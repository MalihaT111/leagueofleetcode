"""
Database models for the application.
"""

from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, Boolean, Text, JSON, Enum, ForeignKey
from src.database.database import Base
import enum


class User(SQLAlchemyBaseUserTable[int], Base):
    """
    User model that matches your existing users table structure
    with additional FastAPI-users required fields.
    """
    __tablename__ = "users"

    # FastAPI-users required fields mapped to actual database columns
    id = Column("user_id", Integer, primary_key=True, index=True, autoincrement=True)
    email = Column("username", String(50), unique=True, nullable=False, index=True)  # username serves as email
    hashed_password = Column("password_hash", String(255), nullable=False)
    
    # Your existing custom fields (matching actual database schema)
    leetcode_hash = Column(String(255), nullable=True)
    leetcode_username = Column(String(50), nullable=True)  # Based on your schema
    user_elo = Column(Integer, default=1200)
    repeating_questions = Column(Boolean, default=False)  # tinyint(1) in your DB
    difficulty = Column(Text, nullable=False, default='["1","2","3"]')  # All difficulties by default
    topics = Column(Text, nullable=False, default='[' + ','.join([f'"{i}"' for i in range(1, 74)]) + ']')  # All topics by default
    winstreak = Column(Integer, default=0, nullable=False)  # Win streak counter
    
    # FastAPI-users required fields (need to be added to your database)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    
    # Additional properties to access database column names directly
    @property
    def user_id(self):
        return self.id
    
    @user_id.setter
    def user_id(self, value):
        self.id = value
    
    @property
    def username(self):
        return self.email
    
    @username.setter
    def username(self, value):
        self.email = value
    
    @property
    def password_hash(self):
        return self.hashed_password
    
    @password_hash.setter
    def password_hash(self, value):
        self.hashed_password = value


    repeating_questions = Column(Boolean, default=False, nullable=False)
    difficulty = Column(JSON, default=["1", "2", "3"], nullable=False)
    topics = Column(JSON, default=[str(i) for i in range(1, 74)], nullable=False)

class MatchHistory(Base):
    __tablename__ = "match_history"

    match_id = Column(Integer, primary_key=True, autoincrement=True)
    winner_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    loser_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    leetcode_problem = Column(String(255), nullable=False)
    elo_change = Column(Integer, nullable=False)
    winner_elo = Column(Integer, nullable=False)
    loser_elo = Column(Integer, nullable=False)
# backend/src/database/models.py