from typing import List
from pydantic import BaseModel, ConfigDict

class MatchResultsOut(BaseModel):
    winner: str
    winner_code: str
    winner_elo: int
    
    loser: str
    loser_code: str
    loser_elo: int
    
    time: float
    
    model_config = ConfigDict(from_attributes=True)
