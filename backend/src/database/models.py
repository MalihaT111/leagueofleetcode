from sqlalchemy import Column, Integer, String, Boolean, JSON, Enum, ForeignKey
import enum
from src.database.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    leetcode_hash = Column(String(255))
    leetcode_username = Column(String(50), unique=True, nullable=False)
    user_elo = Column(Integer, default=1200)
    repeating_questions = Column(Boolean, default=False, nullable=False)
    difficulty = Column(JSON, default=["1", "2", "3"], nullable=False)
    topics = Column(JSON, default=[str(i) for i in range(1, 74)], nullable=False)

# Enum for game_status
class GameStatusEnum(enum.Enum):
    win = "win"
    lose = "lose"
    resign = "resign"
    timeout = "timeout"

class MatchHistory(Base):
    __tablename__ = "match_history"

    match_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    opponent_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    leetcode_problem = Column(String(255), nullable=False)
    game_status = Column(Enum(GameStatusEnum), nullable=False)
    elo_change = Column(Integer, nullable=False)
    user_elo = Column(Integer, nullable=False)
    opponent_elo = Column(Integer, nullable=False)
# backend/src/database/models.py
# Import the FastAPI-users compatible User model
from src.auth.models import User

# Re-export User for backward compatibility
__all__ = ["User"]
