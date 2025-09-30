# backend/src/users/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from . import service, schemas

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = service.create_user(db, user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail="User already exists or invalid input")
