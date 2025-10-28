"""
Pydantic schemas for FastAPI-users matching your users table structure.
"""

from fastapi_users import schemas
from typing import Optional
from pydantic import field_validator


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data - returns all your custom fields."""
    leetcode_username: Optional[str] = None
    user_elo: int = 1200
    leetcode_hash: Optional[str] = None
    repeating_questions: Optional[bool] = False  # tinyint(1) - boolean
    difficulty: str = '["2"]'  # JSON array with single digit strings
    topics: str = '["1"]'  # JSON array with single digit strings
    
    # Note: email field comes from BaseUser and maps to your username column


class UserCreate(schemas.BaseUserCreate):
    """Schema for creating users - requires your essential fields."""
    leetcode_username: str  # Required field
    user_elo: Optional[int] = 1200  # Default value
    difficulty: Optional[str] = '["2"]'  # JSON array with single digit strings
    topics: Optional[str] = '["1"]'  # JSON array with single digit strings
    repeating_questions: Optional[bool] = False  # tinyint(1) - default to False
    
    # Note: email and password fields come from BaseUserCreate
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Ensure password is within bcrypt's 72-byte limit."""
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password cannot be longer than 72 bytes')
        return v


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating users - all fields optional."""
    leetcode_username: Optional[str] = None
    user_elo: Optional[int] = None
    leetcode_hash: Optional[str] = None
    repeating_questions: Optional[str] = None
    difficulty: Optional[str] = None
    topics: Optional[str] = None