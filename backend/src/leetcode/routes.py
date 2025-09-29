from fastapi import APIRouter, Depends, HTTPException
from typing import List
from src.auth.service import AuthService
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats
from src.leetcode.service import LeetCodeService

router = APIRouter()

@router.get("/problems", response_model=List[Problem])
async def get_problems(
    difficulty: str = None,
    tags: List[str] = None,
    limit: int = 50
):
    """Get LeetCode problems with optional filtering"""
    return await LeetCodeService.get_problems(difficulty, tags, limit)

@router.get("/problems/{problem_slug}", response_model=Problem)
async def get_problem(problem_slug: str):
    """Get specific problem details"""
    return await LeetCodeService.get_problem(problem_slug)

@router.get("/user/{username}/submissions", response_model=List[UserSubmission])
async def get_user_submissions(username: str):
    """Get user's recent submissions"""
    return await LeetCodeService.get_user_submissions(username)

@router.get("/user/{username}/stats", response_model=ProblemStats)
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