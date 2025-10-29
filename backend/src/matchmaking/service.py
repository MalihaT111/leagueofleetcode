# src/matchmaking/service.py
from sqlalchemy.orm import Session
from ..database.models import MatchHistory, User

def create_match_record(db: Session, user: User, opponent: User):
    match = MatchHistory(
        user_id=user.user_id,
        opponent_user_id=opponent.user_id,
        leetcode_problem="TBD",
        game_status="timeout",  # placeholder until match completes
        elo_change=0,
        user_elo=user.user_elo,
        opponent_elo=opponent.user_elo
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return match
