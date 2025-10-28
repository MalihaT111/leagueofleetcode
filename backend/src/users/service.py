# backend/src/users/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.hash import bcrypt
from src.database import models
from .schemas import UserCreate

async def create_user(db: AsyncSession, user: UserCreate):
    hashed_pw = bcrypt.hash(user.password)
    db_user = models.User(
        email=user.username,  # Map username to email field
        hashed_password=hashed_pw,  # Use FastAPI-users field name
        leetcode_username=user.leetcode_username,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
