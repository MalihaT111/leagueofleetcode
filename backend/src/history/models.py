from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class MatchHistory(Base):
    __tablename__ = "match_history"

    match_id = Column(Integer, primary_key=True, autoincrement=True)
    winner_id = Column(Integer, nullable=False)
    loser_id = Column(Integer, nullable=False)
    leetcode_problem = Column(String(255), nullable=False)
    elo_change = Column(Integer, nullable=False)
    winner_elo = Column(Integer, nullable=False)
    loser_elo = Column(Integer, nullable=False)
