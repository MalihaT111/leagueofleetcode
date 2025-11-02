from pydantic import BaseModel, ConfigDict
from src.users.schemas import UserSettings  # contains username + elo
from typing import List, Optional

class UserSettingsOut(BaseModel):
    leetcode_username: str
    username: str
    repeat: bool
    difficulty: List[int]
    topics: List[int]

    model_config = ConfigDict(from_attributes=True)

class UpdateUserSettings(BaseModel):
    repeat: Optional[bool] = None
    difficulty: Optional[List[int]] = None
    topics: Optional[List[int]] = None