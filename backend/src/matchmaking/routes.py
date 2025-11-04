# src/matchmaking/routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from ..database.database import get_db
from ..database.models import User, MatchHistory
from ..matchmaking.manager import MatchmakingManager
from ..matchmaking.manager import MATCHMAKING_KEY
from ..matchmaking.schemas import QueueResponse, MatchResponse
from ..leetcode.schemas import Problem

router = APIRouter(tags=["Matchmaking"])
manager = MatchmakingManager()

@router.post("/queue/{user_id}", response_model=QueueResponse)
async def join_queue(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    print(f"🚀 User {user_id} ({user.email}) joining queue with ELO {user.user_elo}")
    
    # First, remove user from queue if they're already there (cleanup)
    await manager.remove_player(user.id)
    
    # Add player to queue
    await manager.add_player(user.id, user.user_elo)

    match = await manager.find_match(user.id, user.user_elo, db)
    if match:
        print(f"🎉 Immediate match found for user {user_id}")
        problem = match.get("problem")
        match_response = MatchResponse(
            match_id=match["match_id"],
            opponent=match["opponent"],
            opponent_elo=match["opponent_elo"],
            problem=problem.dict() if problem else {}
        )
        return QueueResponse(status="matched", match=match_response)
    
    print(f"⏳ User {user_id} added to queue, waiting for opponent")
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
    # Look for any recent match with TBD status (active match)
    recent_match_result = await db.execute(
        select(MatchHistory)
        .where(
            or_(
                MatchHistory.winner_id == user_id,
                MatchHistory.loser_id == user_id
            )
        )
        .where(MatchHistory.leetcode_problem == "TBD")  # Active match indicator
        .order_by(MatchHistory.match_id.desc())
        .limit(1)
    )
    match = recent_match_result.scalar_one_or_none()
    
    if match:
        # Check if match is completed (elo_change != 0 means completed)
        if match.elo_change != 0:
            # Match is completed, determine if user won or lost
            user_won = match.winner_id == user_id
            return QueueResponse(status="completed", match=MatchResponse(
                match_id=match.match_id,
                opponent="",  # Not needed for completed status
                opponent_elo=0,
                problem=manager.problem.dict() if manager.problem else Problem(),
                result="won" if user_won else "lost"
            ))
        
        # Match is still active
        opponent_id = match.loser_id if match.winner_id == user_id else match.winner_id
        opponent_result = await db.execute(select(User).where(User.id == opponent_id))
        opponent = opponent_result.scalar_one_or_none()
        
        if opponent:
            return QueueResponse(
                status="matched",
                match=MatchResponse(
                    match_id=match.match_id,
                    opponent=opponent.email,
                    opponent_elo=opponent.user_elo,
                    problem=manager.problem.dict() if manager.problem else {}
                )
            )
    
    return QueueResponse(status="waiting", match=None)

@router.post("/submit/{match_id}/{user_id}")
async def submit_solution(match_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    """Handle when a user submits their solution and wins the match"""
    
    # Find the match
    match_result = await db.execute(
        select(MatchHistory).where(MatchHistory.match_id == match_id)
    )
    match = match_result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Check if match is already completed
    if match.elo_change != 0:
        raise HTTPException(status_code=400, detail="Match already completed")
    
    # Determine winner and loser
    if match.winner_id == user_id:
        winner_id = match.winner_id
        loser_id = match.loser_id
    elif match.loser_id == user_id:
        winner_id = match.loser_id
        loser_id = match.winner_id
        # Swap winner/loser in the match record
        match.winner_id = winner_id
        match.loser_id = loser_id
    else:
        raise HTTPException(status_code=400, detail="User not in this match")
    
    # Calculate ELO changes (simple +15/-15 for now)
    elo_change = 15
    match.elo_change = elo_change
    
    # Update user ELOs
    winner_result = await db.execute(select(User).where(User.id == winner_id))
    winner = winner_result.scalar_one_or_none()
    loser_result = await db.execute(select(User).where(User.id == loser_id))
    loser = loser_result.scalar_one_or_none()
    
    if winner and loser:
        winner.user_elo += elo_change
        loser.user_elo -= elo_change
        match.winner_elo = winner.user_elo
        match.loser_elo = loser.user_elo
    
    await db.commit()
    
    return {"status": "completed", "winner_id": winner_id, "elo_change": elo_change}

@router.post("/resign/{match_id}/{user_id}")
async def resign_match(match_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    """Handle when a user resigns from a match"""
    
    # Find the match
    match_result = await db.execute(
        select(MatchHistory).where(MatchHistory.match_id == match_id)
    )
    match = match_result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    # Check if match is already completed
    if match.elo_change != 0:
        raise HTTPException(status_code=400, detail="Match already completed")
    
    # Determine winner and loser (resigning user loses)
    if match.winner_id == user_id:
        # User was winner, now becomes loser
        winner_id = match.loser_id
        loser_id = match.winner_id
        match.winner_id = winner_id
        match.loser_id = loser_id
    elif match.loser_id == user_id:
        # User was loser, stays loser
        winner_id = match.winner_id
        loser_id = match.loser_id
    else:
        raise HTTPException(status_code=400, detail="User not in this match")
    
    # Get the problem for this match and update the leetcode_problem field
    problem = manager.get_problem_for_match(match_id)
    if problem:
        try:
            problem_slug = problem.slug if hasattr(problem, 'slug') else str(problem.get('slug', 'unknown'))
            match.leetcode_problem = problem_slug
            print(f"📝 Updated resigned match {match_id} with problem slug: {problem_slug}")
        except Exception as e:
            print(f"⚠️ Error getting problem slug for resigned match {match_id}: {e}")
            match.leetcode_problem = "unknown"
    else:
        print(f"⚠️ Warning: No problem found for resigned match {match_id}")
        match.leetcode_problem = "unknown"
    
    # ELO changes for resignation: winner gets +15, loser loses -10
    winner_elo_change = 15
    loser_elo_change = 10  # Resigning user loses 10 ELO
    match.elo_change = loser_elo_change  # Store the loser's penalty
    
    # Update user ELOs
    winner_result = await db.execute(select(User).where(User.id == winner_id))
    winner = winner_result.scalar_one_or_none()
    loser_result = await db.execute(select(User).where(User.id == loser_id))
    loser = loser_result.scalar_one_or_none()
    
    if winner and loser:
        winner.user_elo += winner_elo_change
        loser.user_elo -= loser_elo_change
        match.winner_elo = winner.user_elo
        match.loser_elo = loser.user_elo
    
    await db.commit()
    
    return {
        "status": "completed", 
        "winner_id": winner_id, 
        "loser_id": loser_id,
        "resignation": True,
        "winner_elo_change": winner_elo_change,
        "loser_elo_change": loser_elo_change
    }

@router.get("/result/{match_id}")
async def get_match_result(match_id: int, db: AsyncSession = Depends(get_db)):
    """Get the result of a completed match"""
    
    # Find the match
    match_result = await db.execute(
        select(MatchHistory).where(MatchHistory.match_id == match_id)
    )
    match = match_result.scalar_one_or_none()
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    
    if match.elo_change == 0:
        raise HTTPException(status_code=400, detail="Match not completed yet")
    
    # Get winner and loser info
    winner_result = await db.execute(select(User).where(User.id == match.winner_id))
    winner = winner_result.scalar_one_or_none()
    
    loser_result = await db.execute(select(User).where(User.id == match.loser_id))
    loser = loser_result.scalar_one_or_none()
    
    if not winner or not loser:
        raise HTTPException(status_code=404, detail="Player data not found")
    
    return {
        "match_id": match.match_id,
        "winner": {
            "id": winner.id,
            "username": winner.leetcode_username or winner.email,
            "elo": match.winner_elo
        },
        "loser": {
            "id": loser.id,
            "username": loser.leetcode_username or loser.email,
            "elo": match.loser_elo
        },
        "elo_change": match.elo_change,
        "problem": match.leetcode_problem,
        "match_duration": match.match_seconds
    }
