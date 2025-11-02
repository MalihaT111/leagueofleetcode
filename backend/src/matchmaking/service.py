# src/matchmaking/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.models import MatchHistory
from ..database.models import User


async def create_match_record(db: AsyncSession, user: User, opponent: User):
    from sqlalchemy import or_, delete
    
    # Clean up any existing TBD records for both users
    await db.execute(
        delete(MatchHistory).where(
            or_(
                MatchHistory.winner_id.in_([user.id, opponent.id]),
                MatchHistory.loser_id.in_([user.id, opponent.id])
            )
        ).where(MatchHistory.leetcode_problem == "TBD")
    )
    
    match = MatchHistory(
        winner_id=user.id,  # Temporary - will be updated when match completes
        loser_id=opponent.id,  # Temporary - will be updated when match completes
        leetcode_problem="TBD",  # Indicates active/pending match
        elo_change=0,
        winner_elo=user.user_elo,
        loser_elo=opponent.user_elo
    )
    db.add(match)
    await db.commit()
    await db.refresh(match)
    return match
