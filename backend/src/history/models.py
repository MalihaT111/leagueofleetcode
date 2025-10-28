from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from src.database.database import Base

class MatchHistoryModel(Base):
    __tablename__ = "match_history"  

    match_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    opponent_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    leetcode_problem = Column(String(255), nullable=False)
    game_status = Column(
        Enum("win", "lose", "resign", "timeout", name="game_status_enum"),
        nullable=False,
    )
    elo_change = Column(Integer, nullable=False)
    user_elo = Column(Integer, nullable=False)
    opponent_elo = Column(Integer, nullable=False)

