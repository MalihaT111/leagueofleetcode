from fastapi import APIRouter, Depends, HTTPException
from typing import List
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats
from src.leetcode.service.leetcode_service import LeetCodeService

router = APIRouter(prefix="/leetcode")

@router.get("/problems/{problem_slug}", response_model=Problem)
async def get_problem(problem_slug: str):
    """Get specific problem details"""
    return await LeetCodeService.get_problem(problem_slug)

# @router.get("/user/{username}/stats", response_model=ProblemStats)
@router.get("/user/{username}/stats")
async def get_user_leetcode_stats(username: str):
    """Get user's LeetCode statistics"""
    return await LeetCodeService.get_user_stats(username)

@router.post("/random-question")
async def get_random_question():
    return await LeetCodeService.get_random_problem()
    