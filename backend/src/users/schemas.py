# backend/src/users/schemas.py
from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    leetcode_username: str
    leetcode_hash: Optional[str] = None
    user_elo: int = 1200
    repeat: bool = False
    difficulty: List[str] = ["1", "2", "3"]
    topics: List[str] = [str(i) for i in range(1, 74)]

class UserCreate(UserBase):
    password: str  # plain text password for registration

class UserResponse(BaseModel):
    user_id: int
    username: str
    leetcode_username: str
    leetcode_hash: Optional[str] = None
    user_elo: int
    repeating_questions: bool
    difficulty: List[str]
    topics: List[str]

    class Config:
        populate_by_name = True

class UserStats(BaseModel):
    username: str
    leetcode_hash: Optional[str]
    leetcode_username: str
    user_elo: int

    class Config:
        from_attributes = True