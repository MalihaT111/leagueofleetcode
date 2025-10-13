"""
Flexible FastAPI-users User model that can adapt to schema changes.
"""

from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, Boolean
from src.database.database import Base


class User(SQLAlchemyBaseUserTable[int], Base):
    """
    Flexible User model for FastAPI-users.
    
    This model can be easily modified to adapt to schema changes.
    Just update the column definitions below as needed.
    """
    __tablename__ = "users"

    # Core FastAPI-users fields (required)
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    
    # Custom fields (modify these as your schema evolves)
    username = Column(String(50), unique=True, nullable=True)  # Optional username
    leetcode_username = Column(String(50), unique=True, nullable=True)
    user_elo = Column(Integer, default=1200)
    leetcode_hash = Column(String(255), nullable=True)
    
    # Add/remove custom fields here as your schema changes
    # display_name = Column(String(100), nullable=True)
    # created_at = Column(DateTime, default=datetime.utcnow)
    # last_login = Column(DateTime, nullable=True)