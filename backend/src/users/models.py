from sqlalchemy import Column, Integer, String, Boolean, JSON
from src.database.database import Base

class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    leetcode_hash = Column(String(255), nullable=True)
    leetcode_username = Column(String(50), unique=True, nullable=False)
    user_elo = Column(Integer, default=1200)
    repeating_questions = Column(Boolean, default=False)
    difficulty = Column(JSON, nullable=False, default=["1", "2", "3"])
    topics = Column(JSON, nullable=False, default=[str(i) for i in range(1, 74)])
