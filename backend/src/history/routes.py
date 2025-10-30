# backend/src/history/routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.database.database import get_db

from .service import calculate_user_stats

router = APIRouter(prefix="/history")

@router.get("/{user_id}")
async def get_user_stats(user_id: int, db: AsyncSession = Depends(get_db)):
    stats = await calculate_user_stats(db, user_id)
    return stats


