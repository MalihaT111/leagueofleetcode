from fastapi import APIRouter, Depends, HTTPException
from typing import List
from src.auth.service import AuthService
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats
from src.leetcode.service.leetcode_service import LeetCodeService

router = APIRouter()

@router.get("/problems/{problem_slug}", response_model=Problem)
async def get_problem(problem_slug: str):
    """Get specific problem details"""
    return await LeetCodeService.get_problem(problem_slug)

# @router.get("/user/{username}/stats", response_model=ProblemStats)
@router.get("/user/{username}/stats")
async def get_user_leetcode_stats(username: str):
    """Get user's LeetCode statistics"""
    return await LeetCodeService.get_user_stats(username)

@router.post("/sync-progress")
async def sync_user_progress(current_user = Depends(AuthService.get_current_user)):
    """Sync current user's LeetCode progress"""
    if not current_user.leetcode_username:
        raise HTTPException(status_code=400, detail="LeetCode username not set")
    
    return await LeetCodeService.sync_user_progress(
        current_user.id, 
        current_user.leetcode_username
    )