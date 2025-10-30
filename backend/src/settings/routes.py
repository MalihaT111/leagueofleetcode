from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.database.database import get_db
from src.settings.service import get_settings_data, update_settings_data
from src.settings.schemas import UserSettingsOut, UpdateUserSettings


router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/{user_id}", response_model=UserSettingsOut)
async def get_settings(user_id: int, db: AsyncSession = Depends(get_db)):
    data = await get_settings_data(db, user_id)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return data

@router.put("/{user_id}", response_model=UserSettingsOut)
async def update_settings(user_id: int, updates: UpdateUserSettings, db: AsyncSession = Depends(get_db)):
    user = await update_settings_data(db, user_id, updates)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return updated state
    return {
        "username": user.username,
        "repeat": user.repeating_questions,
        "difficulty": user.difficulty,
        "topics": user.topics
    }
