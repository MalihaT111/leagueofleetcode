from pydantic import BaseModel, ConfigDict
from src.users.schemas import UserSettings  # contains username + elo
from typing import List, Optional

class UserSettingsOut(BaseModel):
    username: str
    repeat: bool
    difficulty: List[str]  # ✅ Fix: these are numbers
    topics: List[str]      # ✅ topics too, since they’re numeric

    model_config = ConfigDict(from_attributes=True)




class UpdateUserSettings(BaseModel):
    repeat: Optional[bool] = None
    difficulty: Optional[List[int]] = None
    topics: Optional[List[int]] = None