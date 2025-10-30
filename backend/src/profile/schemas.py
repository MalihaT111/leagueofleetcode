from pydantic import BaseModel
from typing import List
from src.history.schemas import MatchBase
from src.users.schemas import UserBase
# from src.auth.schemas import UserOut  # or from src.users.schemas if you keep User schemas there


class ProfileOut(BaseModel):
    user: UserBase
    history: List[MatchBase]
