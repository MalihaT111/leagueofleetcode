from pydantic import BaseModel, ConfigDict
from typing import Literal, List

# -----------------------------
# Base schema (shared fields)
# -----------------------------
class MatchBase(BaseModel):
    user_id: int
    opponent_user_id: int
    leetcode_problem: str
    elo_change: int
    user_elo: int
    opponent_elo: int

    model_config = ConfigDict(from_attributes=True)  # ✅ v2 ORM support

# -----------------------------
# Schema for a recent match summary
# -----------------------------
class RecentMatch(BaseModel):
    outcome: Literal["win", "lose"]
    rating_change: int
    question: str

    model_config = ConfigDict(from_attributes=True)

# -----------------------------
# Schema for user stats response
# -----------------------------
class UserStatsResponse(BaseModel):
    matches_won: int
    win_rate: float
    win_streak: int
    recent_matches: List[RecentMatch]

    model_config = ConfigDict(from_attributes=True)
