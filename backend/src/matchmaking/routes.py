# src/matchmaking/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..auth.models import User
from ..matchmaking.manager import MatchmakingManager
from ..matchmaking.schemas import QueueResponse

router = APIRouter(tags=["Matchmaking"])
manager = MatchmakingManager()

@router.post("/queue/{user_id}", response_model=QueueResponse)
async def join_queue(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await manager.add_player(user.user_id, user.user_elo)

    match = await manager.find_match(user.user_id, user.user_elo, db)
    if match:
        return QueueResponse(status="matched", match=match)
    return QueueResponse(status="queued", match=None)

@router.post("/leave/{user_id}")
async def leave_queue(user_id: int):
    await manager.remove_player(user_id)
    return {"status": "left"}
