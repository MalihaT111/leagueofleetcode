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

class UserResponse(UserBase):
    user_id: int

    class Config:
        from_attributes = True  # (ORM mode in Pydantic v2)

class UserStats(BaseModel):
    username: str
    leetcode_hash: Optional[str]
    leetcode_username: str
    user_elo: int

    class Config:
        from_attributes = True