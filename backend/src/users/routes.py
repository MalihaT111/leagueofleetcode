# backend/src/users/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.service import AuthService
from src.database.database import get_db
from src.users import schemas
from src.users.service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=schemas.UserResponse)
async def register_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    try:
        db_user = await UserService.create_user(db, user)
        return db_user
    except Exception as e:
        raise HTTPException(
            status_code=400, detail="User already exists or invalid input"
        )


@router.get("/profile", response_model=schemas.UserProfile)
async def get_user_profile(current_user=Depends(AuthService.get_current_user), db: AsyncSession = Depends(get_db)):
    """Get current user's profile"""
    user = await UserService.get_user_profile(db, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/profile", response_model=schemas.UserProfile)
async def update_user_profile(
    user_update: schemas.UserUpdate,
    current_user=Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user's profile"""
    user = await UserService.update_user_profile(db, current_user.id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/stats", response_model=schemas.UserStats)
async def get_user_stats(current_user=Depends(AuthService.get_current_user), db: AsyncSession = Depends(get_db)):
    """Get user's LeetCode statistics"""
    stats = await UserService.get_user_stats(db, current_user.id)
    if not stats:
        raise HTTPException(status_code=404, detail="Stats not available")
    return stats
