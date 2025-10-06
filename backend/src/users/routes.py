from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.database import get_db
from . import service, schemas
from src.database.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = service.create_user(db, user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail="User already exists or invalid input")

@router.get("/{user_id}", response_model=schemas.UserStats)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Fetch username, leetcode_hash, leetcode_username, and user_elo
    for a single user by user_id.
    """
    user = db.query(
        User.username,
        User.leetcode_hash,
        User.leetcode_username,
        User.user_elo
    ).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user.username,
        "leetcode_hash": user.leetcode_hash,
        "leetcode_username": user.leetcode_username,
        "user_elo": user.user_elo
    }