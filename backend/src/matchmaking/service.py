# src/matchmaking/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.models import MatchHistory
from ..database.models import User


async def create_match_record(db: AsyncSession, user: User, opponent: User):
    match = MatchHistory(
        user_id=user.id,
        opponent_user_id=opponent.id,
        leetcode_problem="TBD",
        game_status="timeout",  # placeholder until match completes
        elo_change=0,
        user_elo=user.user_elo,
        opponent_elo=opponent.user_elo
    )
    db.add(match)
    await db.commit()
    await db.refresh(match)
    return match
