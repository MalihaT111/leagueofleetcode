from sqlalchemy.orm import Session
from src.database.models import User
from src.users.schemas import UserCreate
from passlib.hash import bcrypt

def create_user(db: Session, user: UserCreate):
    existing = db.query(User).filter_by(username=user.username).first()
    if existing:
        raise ValueError("Username already exists")

    hashed_pw = bcrypt.hash(user.password)
    new_user = User(
        username=user.username,
        password_hash=hashed_pw,
        leetcode_username=user.leetcode_username,
        leetcode_hash=user.leetcode_hash,
        user_elo=user.user_elo,
        repeat=user.repeat,
        difficulty=user.difficulty,
        topics=user.topics
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user(db: Session, user_id: int):
    return db.query(User).filter_by(user_id=user_id).first()

def update_user(db: Session, user_id: int, updates: dict):
    user = db.query(User).filter_by(user_id=user_id).first()
    if not user:
        return None
    for key, value in updates.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter_by(user_id=user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False
