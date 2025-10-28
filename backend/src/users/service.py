# backend/src/users/service.py
import json
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
        leetcode_hash=user.leetcode_hash,
        user_elo=user.user_elo,
        repeating_questions=user.repeat,  # Map repeat to repeating_questions
        difficulty=json.dumps(user.difficulty) if user.difficulty else '["2"]',  # Convert list to JSON string
        topics=json.dumps(user.topics) if user.topics else '["1"]',  # Convert list to JSON string
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
