# backend/src/history/routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.database import get_db
from src.history import schemas, service

router = APIRouter(prefix="/api/history", tags=["history"])

@router.post("/", response_model=schemas.MatchResponse)
def create_match(match: schemas.MatchCreate, db: Session = Depends(get_db)):
    return service.record_match(db, match)

@router.get("/user/{user_id}", response_model=list[schemas.MatchResponse])
def get_user_history(user_id: int, db: Session = Depends(get_db)):
    return service.fetch_user_history(db, user_id)
