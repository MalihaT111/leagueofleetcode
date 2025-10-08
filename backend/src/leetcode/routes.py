from fastapi import APIRouter, Depends, HTTPException
from typing import List
from src.auth.service import AuthService
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats
from src.leetcode.service import LeetCodeService

leetcode_router = APIRouter()

# test endpoints currently. Service functions will be used to populate database instead
    
@leetcode_router.get("/problem/{problem_slug}", response_model=Problem)
async def get_problem(problem_slug: str):
    """Get specific problem details"""
    problem = await LeetCodeService.get_problem(problem_slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@leetcode_router.get("/users/{username}/submissions", response_model=List[UserSubmission])
async def get_user_submissions(username: str):
    """Get user's recent submissions"""
    return await LeetCodeService.get_user_submissions(username)


@leetcode_router.get("/users/{username}/stats", response_model=ProblemStats)
async def get_user_leetcode_stats(username: str):
    """Get user's LeetCode statistics"""
    return await LeetCodeService.get_user_stats(username)


@leetcode_router.post("/sync-progress", status_code=202)
async def sync_user_progress(current_user = Depends(AuthService.get_current_user)):
    """Sync current user's LeetCode progress"""
    if not current_user.leetcode_username:
        raise HTTPException(status_code=400, detail="LeetCode username not set")
    
    return await LeetCodeService.sync_user_progress(
        current_user.id, 
        current_user.leetcode_username
    )