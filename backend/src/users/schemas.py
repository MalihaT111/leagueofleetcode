# backend/src/users/schemas.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    leetcode_username: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    leetcode_username: str
    user_elo: int

    class Config:
        orm_mode = True


class UserStats(BaseModel):
    username: str
    leetcode_hash: str | None
    leetcode_username: str
    user_elo: int

    class Config:
        from_attributes = True