"""
FastAPI-users User model matching your existing database schema.
"""

from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, Boolean, Text
from src.database.database import Base


class User(SQLAlchemyBaseUserTable[int], Base):
    """
    User model that matches your existing users table structure
    with additional FastAPI-users required fields.
    """
    __tablename__ = "users"

    # Map your existing columns to FastAPI-users requirements
    id = Column("user_id", Integer, primary_key=True, index=True, autoincrement=True)
    email = Column("username", String(50), unique=True, nullable=False, index=True)  # username serves as email
    hashed_password = Column("password_hash", String(255), nullable=False)
    
    # Your existing custom fields (matching actual database schema)
    leetcode_hash = Column(String(255), nullable=True)
    leetcode_username = Column(String(50), nullable=True)  # Based on your schema
    user_elo = Column(Integer, default=1200)
    repeating_questions = Column(Boolean, default=False)  # tinyint(1) in your DB
    difficulty = Column(Text, nullable=False, default='["2"]')  # JSON array with single digit string
    topics = Column(Text, nullable=False, default='["1"]')  # JSON array with single digit strings
    winstreak = Column(Integer, default=0, nullable=False)  # Win streak counter
    
    # FastAPI-users required fields (need to be added to your database)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    
