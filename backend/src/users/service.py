from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from src.database.models import User as UserModel
from src.history.models import MatchHistory


async def get_profile_data(db: AsyncSession, user_id: int) -> Optional[Dict[str, Any]]:
    # Fetch only username and elo for the user
    user_result = await db.execute(
        select(UserModel.username, UserModel.elo)
        .where(UserModel.id == user_id)
    )
    user_row = user_result.one_or_none()
    if not user_row:
        return None

    # Convert to dictionary
    user_data = {
        "username": user_row.username,
        "elo": user_row.elo,
    }

    history_result = await db.execute(
        select(MatchHistory)
        .where(
            or_(
                MatchHistory.user_id == user_id,
                MatchHistory.opponent_user_id == user_id,
            )
        )
        .order_by(MatchHistory.match_id.desc())
        .limit(5)
    )
    history: List[MatchHistory] = history_result.scalars().all()

    # Return structured data
    return {
        "user": user_data,
        "history": history,
    }

async def get_user_settings_data(db: AsyncSession, user_id: int) -> Optional[Dict[str, Any]]:
    """Fetch all relevant user settings/preferences."""
    result = await db.execute(
        select(
            UserModel.username,
            UserModel.elo,
            UserModel.repeat,
            UserModel.difficulty,
            UserModel.topics
        ).where(UserModel.id == user_id)
    )
    row = result.one_or_none()
    if not row:
        return None

    return {
        "username": row.username,
        "elo": row.elo,
        "repeat": row.repeat,
        "difficulty": row.difficulty,
        "topics": row.topics,
    }
