from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.profile.service import get_profile_data
from src.profile.schemas import ProfileOut
from src.database.database import get_db

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.get("/{user_id}", response_model=ProfileOut)
async def get_profile(user_id: int, db: AsyncSession = Depends(get_db)):

    data = await get_profile_data(db, user_id)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return data
