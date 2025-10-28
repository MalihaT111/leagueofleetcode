from pydantic import BaseModel
from typing import Literal, Optional

# -----------------------------
# Base schema (shared fields)
# -----------------------------
class MatchBase(BaseModel):
    user_id: int
    opponent_user_id: int
    leetcode_problem: str
    game_status: Literal["win", "lose", "resign", "timeout"]
    elo_change: int
    user_elo: int
    opponent_elo: int

# -----------------------------
# Schema for creating a new match
# -----------------------------
class MatchCreate(MatchBase):
    pass  # nothing extra for now, but you could later add timestamp or notes

# -----------------------------
# Schema for returning match info
# -----------------------------
class MatchResponse(MatchBase):
    match_id: int

    class Config:
        from_attributes = True  # allows ORM → Pydantic conversion
