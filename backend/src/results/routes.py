# src/results/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.database import get_db
from .service import ResultsService

router = APIRouter(prefix="/match-result", tags=["Match Results"])

@router.get("/{match_id}")
async def get_match_result(
    match_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get match result by match ID - publicly viewable."""
    
    # Validate match_id
    if match_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid match ID"
        )
    
    try:
        # Use service layer to get match result
        match_result = await ResultsService.get_match_result_by_id(db, match_id)
        
        print(match_result)
        
        if not match_result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Match with ID {match_id} not found"
            )
        
        return match_result
        
    except HTTPException:
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Database error for match {match_id}: {str(e)}")

@router.get("/")
async def list_recent_matches(
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """List recent matches for testing purposes."""
    
    try:
        # Use service layer to get recent matches
        return await ResultsService.get_recent_matches(db, limit)
        
    except Exception as e:
        # Fallback with mock data
        return ResultsService.get_mock_recent_matches()

@router.get("/user/{user_id}/history")
async def get_user_match_history(
    user_id: int,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get match history for a specific user."""
    
    try:
        # Use service layer to get user match history
        history = await ResultsService.get_user_match_history(db, user_id, limit)
        
        return {
            "user_id": user_id,
            "matches": history,
            "total": len(history)
        }
        
    except Exception as e:
        # Log error and return empty history
        print(f"Error getting match history for user {user_id}: {str(e)}")
        return {
            "user_id": user_id,
            "matches": [],
            "total": 0
        }