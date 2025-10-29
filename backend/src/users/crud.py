from sqlalchemy.orm import Session
from fastapi import HTTPException
from passlib.context import CryptContext

from src.users import models, schemas  # use plural "models" to match convention

# --- password hashing setup ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ================================
# CRUD Operations
# ================================

def create_user(db: Session, user: schemas.UserCreate):
    # Check for duplicate username or leetcode_username
    existing = db.query(models.User).filter(
        (models.User.username == user.username) |
        (models.User.leetcode_username == user.leetcode_username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or LeetCode username already exists")

    # Hash password before storing
    hashed_pw = hash_password(user.password)

    new_user = models.User(
        username=user.username,
        password_hash=hashed_pw,
        leetcode_username=user.leetcode_username,
        leetcode_hash=user.leetcode_hash,
        user_elo=user.user_elo,
        repeating_questions=user.repeat,
        difficulty=user.difficulty,
        topics=user.topics,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_all_users(db: Session):
    return db.query(models.User).all()
