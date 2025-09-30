# backend/src/users/service.py
from passlib.hash import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.users.schemas import (
    UserProfile,
    UserUpdate,
    UserStats,
    UserCreate,
    UserResponse,
)
from src.database.models import UserModel
from src.leetcode.service import LeetCodeService


class UserService:
    @staticmethod
    async def create_user(db: AsyncSession, user: UserCreate) -> UserResponse:
        hashed_pw = bcrypt.hash(user.password)

        db_user = UserModel(
            email=user.email,
            username=user.username,
            password_hash=hashed_pw,
            leetcode_username=user.leetcode_username,
        )

        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)

        return UserResponse(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            leetcode_username=db_user.leetcode_username,
            user_elo=db_user.user_elo,
        )

    @staticmethod
    async def get_user_profile(db: AsyncSession, user_id: int) -> UserProfile:
        result = await db.execute(select(UserModel).where(UserModel.id == user_id))
        user = result.scalars().first()
        if not user:
            return None
        return UserProfile.model_validate(user)

    @staticmethod
    async def update_user_profile(
        db: AsyncSession, user_id: int, user_update: UserUpdate
    ) -> UserProfile:
        result = await db.execute(select(UserModel).where(UserModel.id == user_id))
        user = result.scalars().first()
        if not user:
            return None

        if user_update.username is not None:
            user.username = user_update.username
        if user_update.leetcode_username is not None:
            user.leetcode_username = user_update.leetcode_username

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return UserProfile.model_validate(user)

    @staticmethod
    async def get_user_stats(
        db: AsyncSession, user_id: int, lc_service: LeetCodeService
    ) -> UserStats:
        result = await db.execute(select(UserModel).where(UserModel.id == user_id))
        user = result.scalars().first()
        if not user or not user.leetcode_username:
            return None

        stats = await lc_service.fetch_stats(user.leetcode_username)
        return UserStats(**stats)
