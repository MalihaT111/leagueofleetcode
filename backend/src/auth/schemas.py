"""
Simple Pydantic schemas for FastAPI-users.
"""

from fastapi_users import schemas
from typing import Optional


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data."""
    username: Optional[str] = None
    leetcode_username: Optional[str] = None
    user_elo: int = 1200
    
    # Add/remove fields here as your schema changes
    # display_name: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating users."""
    username: Optional[str] = None
    leetcode_username: Optional[str] = None
    
    # Add/remove fields here as your schema changes
    # display_name: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating users."""
    username: Optional[str] = None
    leetcode_username: Optional[str] = None
    user_elo: Optional[int] = None
    
    # Add/remove fields here as your schema changes
    # display_name: Optional[str] = None