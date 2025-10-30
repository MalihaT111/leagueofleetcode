# src/matchmaking/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.models import MatchHistory
from ..database.models import User


async def create_match_record(db: AsyncSession, winner: User, loser: User):
    match = MatchHistory(
        winner_id=winner.id,
        opponent_user_id=loser.id,
        leetcode_problem="TBD",
        elo_change=0,
        winner_elo=winner.user_elo,
        loser_elo=loser.user_elo
    )
    db.add(match)
    await db.commit()
    await db.refresh(match)
    return match
