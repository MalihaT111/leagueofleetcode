# backend/src/users/service.py
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import models
from .schemas import UserCreate

def create_user(db: Session, user: UserCreate):
    hashed_pw = bcrypt.hash(user.password)
    db_user = models.User(
        username=user.username,
        password_hash=hashed_pw,
        leetcode_username=user.leetcode_username,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
