# backend/src/history/service.py
from sqlalchemy.orm import Session
from src.history import crud, schemas

def record_match(db: Session, match_data: schemas.MatchCreate):
    return crud.create_match(db, match_data)

def fetch_user_history(db: Session, user_id: int):
    return crud.get_matches_by_user(db, user_id)
