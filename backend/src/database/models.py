# backend/src/database/models.py
from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    leetcode_hash = Column(String(255), nullable=True)
    leetcode_username = Column(String(50), unique=True, nullable=False)
    user_elo = Column(Integer, default=1200)
