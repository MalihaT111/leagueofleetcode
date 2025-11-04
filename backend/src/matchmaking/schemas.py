# src/matchmaking/schemas.py
from pydantic import BaseModel
from typing import Optional

class MatchResponse(BaseModel):
    match_id: int
    opponent: str
    opponent_elo: int
    problem: dict = {}
    result: str = ""  # "won", "lost", or empty for active matches

class QueueResponse(BaseModel):
    status: str
    match: Optional[MatchResponse]