# backend/src/history/crud.py
from sqlalchemy.orm import Session
from src.history import models, schemas

def create_match(db: Session, match: schemas.MatchCreate):
    new_match = models.MatchHistoryModel(**match.dict())
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

def get_matches_by_user(db: Session, user_id: int):
    return db.query(models.MatchHistoryModel).filter(
        models.MatchHistoryModel.user_id == user_id
    ).all()
