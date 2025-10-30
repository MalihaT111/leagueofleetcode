from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from src.users.models import UserModel  
from src.history.schemas import RecentMatch as MatchHistory


async def get_profile_data(db: AsyncSession, user_id: int):
    # Get user info
    user_result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = user_result.scalar_one_or_none()
    if not user:
        return None

    # Get last 10 matches involving the user
    history_result = await db.execute(
        select(MatchHistory)
        .where(or_(MatchHistory.user_id == user_id, MatchHistory.opponent_user_id == user_id))
        .order_by(MatchHistory.match_id.desc())
        .limit(10)
    )
    history = history_result.scalars().all()

    return {"user": user, "history": history}
