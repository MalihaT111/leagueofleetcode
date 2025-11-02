# src/settings/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.database.models import User as UserModel
from typing import Optional
from src.settings.schemas import UserSettingsOut, UpdateUserSettings


async def get_settings_data(db: AsyncSession, user_id: int) -> Optional[UserSettingsOut]:
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return None

    return UserSettingsOut(
        leetcode_username=user.leetcode_username,
        username=user.username,
        repeat=user.repeating_questions,
        difficulty=[str(d) for d in (user.difficulty or [])],
        topics=[str(t) for t in (user.topics or [])]
    )


async def update_settings_data(db: AsyncSession, user_id: int, data: UpdateUserSettings) -> Optional[UserModel]:
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return None
    print(user_id)
    if data.repeat is not None:
        user.repeating_questions = data.repeat
    if data.difficulty is not None:
        user.difficulty = data.difficulty
    if data.topics is not None:
        user.topics = data.topics

    await db.commit()
    await db.refresh(user)
    return user