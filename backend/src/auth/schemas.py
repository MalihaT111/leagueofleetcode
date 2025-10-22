"""
Pydantic schemas for FastAPI-users matching your users table structure.
"""

from fastapi_users import schemas
from typing import Optional


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data - returns all your custom fields."""
    leetcode_username: str
    user_elo: int = 1200
    leetcode_hash: Optional[str] = None
    repeating_questions: Optional[str] = None
    difficulty: Optional[str] = None
    topics: Optional[str] = None
    
    # Note: email field comes from BaseUser and maps to your username column


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating users - requires your essential fields."""
    leetcode_username: str  # Required field
    user_elo: Optional[int] = 1200  # Default value
    difficulty: Optional[str] = None
    topics: Optional[str] = None
    repeating_questions: Optional[str] = None
    
    # Note: email and password fields come from BaseUserCreate


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating users - all fields optional."""
    leetcode_username: Optional[str] = None
    user_elo: Optional[int] = None
    leetcode_hash: Optional[str] = None
    repeating_questions: Optional[str] = None
    difficulty: Optional[str] = None
    topics: Optional[str] = None