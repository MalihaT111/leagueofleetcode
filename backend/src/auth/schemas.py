"""
Pydantic schemas for FastAPI-users matching your users table structure.
"""

from fastapi_users import schemas
from typing import Optional, List
from pydantic import field_validator


class UserRead(schemas.BaseUser[int]):
    """Schema for reading user data - returns all your custom fields."""
    leetcode_username: Optional[str] = None
    user_elo: int = 1200
    leetcode_hash: Optional[str] = None
    repeating_questions: Optional[bool] = False  # tinyint(1) - boolean
    difficulty: List[str] = ["1", "2", "3"]  # List of difficulty levels
    topics: List[str] = [str(i) for i in range(1, 74)]  # List of topic IDs
    winstreak: int = 0  # Win streak counter
    
    # Note: email field comes from BaseUser and maps to your username column

class UserCreate(schemas.BaseUserCreate):
    """Schema for creating users - requires your essential fields."""
    leetcode_username: str  # Required field
    user_elo: Optional[int] = 1200  # Default value
    difficulty: Optional[List[str]] = ["1", "2", "3"]  # List of difficulty levels
    topics: Optional[List[str]] = [str(i) for i in range(1, 74)]  # List of topic IDs
    repeating_questions: Optional[bool] = False  # tinyint(1) - default to False
    winstreak: Optional[int] = 0  # Win streak counter - default to 0
    


class UserUpdate(schemas.BaseUserUpdate):
    """Schema for updating users - all fields optional."""
    leetcode_username: Optional[str] = None
    user_elo: Optional[int] = None
    leetcode_hash: Optional[str] = None
    repeating_questions: Optional[bool] = False 
    difficulty: Optional[str] = None
    topics: Optional[str] = None
    winstreak: Optional[int] = None