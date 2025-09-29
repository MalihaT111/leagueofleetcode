from fastapi import APIRouter, Depends, HTTPException
from typing import List
from src.auth.service import AuthService
from src.users.schemas import UserProfile, UserUpdate
from src.users.service import UserService

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user = Depends(AuthService.get_current_user)):
    """Get current user's profile"""
    return await UserService.get_user_profile(current_user.id)

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_update: UserUpdate,
    current_user = Depends(AuthService.get_current_user)
):
    """Update current user's profile"""
    return await UserService.update_user_profile(current_user.id, user_update)

@router.get("/stats")
async def get_user_stats(current_user = Depends(AuthService.get_current_user)):
    """Get user's LeetCode statistics"""
    return await UserService.get_user_stats(current_user.id)