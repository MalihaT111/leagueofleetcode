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
    
    # Your existing custom fields
    leetcode_hash = Column(String(255), nullable=True)
    leetcode_username = Column(String(50), unique=True, nullable=False)
    user_elo = Column(Integer, default=1200)
    repeating_questions = Column(Text, nullable=True)  # Assuming this stores JSON or text
    difficulty = Column(String(20), nullable=True)  # e.g., "easy", "medium", "hard"
    topics = Column(Text, nullable=True)  # Assuming this stores JSON or comma-separated topics
    
    # FastAPI-users required fields (new columns to add to your table)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    
    # Backward compatibility properties for your existing code
    @property
    def user_id(self) -> int:
        """Backward compatibility: map id to user_id."""
        return self.id
    
    @user_id.setter
    def user_id(self, value: int) -> None:
        """Backward compatibility: set id when user_id is assigned."""
        self.id = value

    @property
    def username(self) -> str:
        """Backward compatibility: map email to username."""
        return self.email
    
    @username.setter
    def username(self, value: str) -> None:
        """Backward compatibility: set email when username is assigned."""
        self.email = value

    @property
    def password_hash(self) -> str:
        """Backward compatibility: map hashed_password to password_hash."""
        return self.hashed_password
    
    @password_hash.setter
    def password_hash(self, value: str) -> None:
        """Backward compatibility: set hashed_password when password_hash is assigned."""
        self.hashed_password = value