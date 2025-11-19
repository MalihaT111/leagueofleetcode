"""
Custom registration routes for two-step registration process.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional

from src.database.database import get_db
from src.database.models import User
from src.auth.temp_registration import (
    create_temp_registration,
    get_temp_registration,
    delete_temp_registration
)
from src.auth.auth import password_helper
from src.leetcode.service.leetcode_service import LeetCodeService

router = APIRouter()

class InitialRegistrationRequest(BaseModel):
    email: EmailStr
    password: str

class InitialRegistrationResponse(BaseModel):
    message: str
    leetcode_hash: str
    email: str

class CompleteRegistrationRequest(BaseModel):
    email: EmailStr
    leetcode_username: str

class CompleteRegistrationResponse(BaseModel):
    message: str
    user_id: int
    email: str
    leetcode_username: str

@router.post("/register/init", response_model=InitialRegistrationResponse)
async def initial_registration(
    data: InitialRegistrationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Step 1: Initial registration - collect email/password and generate verification hash.
    Does NOT create user in database yet.
    """
    # Check if email already exists in database
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered. Please sign in instead."
        )
    
    # Validate password length for bcrypt
    if len(data.password.encode('utf-8')) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password cannot be longer than 72 bytes"
        )
    
    # Hash the password
    hashed_password = password_helper.hash(data.password)
    
    # Create temporary registration and get verification hash
    leetcode_hash = create_temp_registration(data.email, hashed_password)
    
    return InitialRegistrationResponse(
        message="Registration initiated. Please add the verification hash to your LeetCode profile.",
        leetcode_hash=leetcode_hash,
        email=data.email
    )

@router.post("/register/complete", response_model=CompleteRegistrationResponse)
async def complete_registration(
    data: CompleteRegistrationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Step 2: Complete registration - verify LeetCode username and create user in database.
    """
    # Get temporary registration data
    temp_reg = get_temp_registration(data.email)
    
    if not temp_reg:
        raise HTTPException(
            status_code=400,
            detail="Registration session not found or expired. Please start registration again."
        )
    
    # Check if LeetCode username is already taken
    result = await db.execute(
        select(User).where(User.leetcode_username == data.leetcode_username)
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="This LeetCode username is already linked to another account"
        )
    
    # Verify that the user has added the hash to their LeetCode profile
    try:
        profile = await LeetCodeService.get_user_profile_summary(data.leetcode_username)
        about_me = profile.get("aboutMe", "")
        
        # Check if the verification hash is in the user's bio
        if temp_reg.leetcode_hash not in about_me:
            raise HTTPException(
                status_code=400,
                detail="Verification hash not found in your LeetCode profile bio. Please add the hash to your profile and try again."
            )
    except HTTPException as e:
        # Re-raise our custom exceptions
        raise e
    except Exception as e:
        # Handle LeetCode API errors
        raise HTTPException(
            status_code=400,
            detail=f"Failed to verify LeetCode profile: {str(e)}"
        )
    
    # Create the actual user in database
    new_user = User(
        email=data.email,
        hashed_password=temp_reg.hashed_password,
        leetcode_username=data.leetcode_username,
        leetcode_hash=temp_reg.leetcode_hash,
        user_elo=temp_reg.user_elo,
        is_active=True,
        is_verified=True,
        is_superuser=False
    )
    
    db.add(new_user)
    
    try:
        await db.commit()
        await db.refresh(new_user)
    except Exception as e:
        await db.rollback()
        error_msg = str(e)
        if "Duplicate entry" in error_msg:
            raise HTTPException(
                status_code=400,
                detail="Email or LeetCode username already exists"
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create user: {error_msg}"
        )
    
    # Clean up temporary registration
    delete_temp_registration(data.email)
    
    return CompleteRegistrationResponse(
        message="Registration completed successfully",
        user_id=new_user.id,
        email=new_user.email,
        leetcode_username=new_user.leetcode_username
    )

@router.get("/register/status/{email}")
async def check_registration_status(email: str):
    """
    Check if there's a pending registration for an email.
    """
    temp_reg = get_temp_registration(email)
    
    if not temp_reg:
        return {
            "status": "not_found",
            "message": "No pending registration found"
        }
    
    return {
        "status": "pending",
        "email": email,
        "leetcode_hash": temp_reg.leetcode_hash,
        "expires_at": temp_reg.expires_at.isoformat()
    }
