from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.database.database import get_db
from src.users import service, schemas

router = APIRouter()

@router.post("/", response_model=schemas.UserResponse)
async def register_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        db_user = await service.create_user(db, user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail="User already exists or invalid input")

@router.get("/{user_id}", response_model=schemas.UserStats)
async def get_user_by_id(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    Fetch email, leetcode_hash, leetcode_username, and user_elo
    for a single user by user_id.
    """
    result = await db.execute(
        select(User.email, User.leetcode_hash, User.leetcode_username, User.user_elo)
        .where(User.id == user_id)
    )
    user = result.first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user.email,  # Map email back to username for API response
        "leetcode_hash": user.leetcode_hash,
        "leetcode_username": user.leetcode_username,
        "user_elo": user.user_elo
    }