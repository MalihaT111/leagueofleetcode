from sqlalchemy import Column, Integer, String, Boolean, JSON
from src.database.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    leetcode_hash = Column(String(255))
    leetcode_username = Column(String(50), unique=True, nullable=False)
    user_elo = Column(Integer, default=1200)
    repeat = Column(Boolean, default=False, nullable=False)
    difficulty = Column(JSON, default=["1", "2", "3"], nullable=False)
    topics = Column(JSON, default=[str(i) for i in range(1, 74)], nullable=False)
