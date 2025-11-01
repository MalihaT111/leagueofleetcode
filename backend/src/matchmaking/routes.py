# src/matchmaking/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from ..database.database import get_db
from ..database.models import User, MatchHistory
from ..matchmaking.manager import MatchmakingManager
from ..matchmaking.manager import MATCHMAKING_KEY
from ..matchmaking.schemas import QueueResponse, MatchResponse

router = APIRouter(tags=["Matchmaking"])
manager = MatchmakingManager()

@router.post("/queue/{user_id}", response_model=QueueResponse)
async def join_queue(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await manager.add_player(user.id, user.user_elo)

    match = await manager.find_match(user.id, user.user_elo, db)
    if match:
        match_response = MatchResponse(
            match_id=match["match_id"],
            opponent=match["opponent"],
            opponent_elo=match["opponent_elo"]
        )
        return QueueResponse(status="matched", match=match_response)
    return QueueResponse(status="queued", match=None)

@router.post("/leave/{user_id}")
async def leave_queue(user_id: int):
    await manager.remove_player(user_id)
    return {"status": "left"}

@router.get("/status/{user_id}")
async def get_match_status(user_id: int, db: AsyncSession = Depends(get_db)):
    """Check if user has been matched while waiting in queue"""
    
    # First check if user is still in Redis queue - if they are, they can't be matched yet
    redis = await manager.connect()
    user_in_queue = await redis.zscore(MATCHMAKING_KEY, user_id)
    
    if user_in_queue is not None:
        # User is still in queue, so no match yet
        return QueueResponse(status="waiting", match=None)
    
    # User is not in queue, check if they have a recent match with "TBD" problem
    # Only look for very recent matches (last 3 match IDs to avoid old stale records)
    latest_match_result = await db.execute(
        select(MatchHistory.match_id).order_by(MatchHistory.match_id.desc()).limit(1)
    )
    latest_match_id = latest_match_result.scalar_one_or_none()
    
    if latest_match_id:
        recent_match = await db.execute(
            select(MatchHistory)
            .where(
                or_(
                    MatchHistory.winner_id == user_id,
                    MatchHistory.loser_id == user_id
                )
            )
            .where(MatchHistory.leetcode_problem == "TBD")  # Active match indicator
            .where(MatchHistory.match_id >= latest_match_id - 2)  # Only very recent matches (last 3)
            .order_by(MatchHistory.match_id.desc())
            .limit(1)
        )
    else:
        recent_match = None
    match = recent_match.scalar_one_or_none() if recent_match else None
    
    if match:
        # Determine opponent
        opponent_id = match.loser_id if match.winner_id == user_id else match.winner_id
        opponent_result = await db.execute(select(User).where(User.id == opponent_id))
        opponent = opponent_result.scalar_one_or_none()
        
        if opponent:
            return QueueResponse(
                status="matched",
                match=MatchResponse(
                    match_id=match.match_id,
                    opponent=opponent.email,
                    opponent_elo=opponent.user_elo
                )
            )
    
    return QueueResponse(status="waiting", match=None)
