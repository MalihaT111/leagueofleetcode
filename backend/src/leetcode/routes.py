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

@router.get("/user/{username}/submissions", response_model=List[UserSubmission])
async def get_user_submissions(username: str):
    """Get user's LeetCode submissions"""
    return await LeetCodeService.get_user_submissions(username)

@router.get("/user/{username}/recent-submission", response_model=UserSubmission)
async def get_recent_user_submission(username: str):
    """Get user's most recent LeetCode submission"""
    return await LeetCodeService.get_recent_user_submission(username)

@router.get("/user/{username}/profile")
async def get_user_profile_summary(username: str):
    """Get user's LeetCode profile summary including bio (aboutMe)"""
    return await LeetCodeService.get_user_profile_summary(username)


@router.get("/questions")
async def get_all_questions():
    return await LeetCodeService.fetch_leetcode_questions()

@router.post("/refresh-topic-map")
async def refresh_topic_map():
    result = await LeetCodeService.refresh_topic_difficulty_map()
    return result

@router.get("/topic-map")
async def get_topic_map():
    from src.leetcode.service.leetcode_service import TOPIC_MAP_CACHE
    
    if TOPIC_MAP_CACHE is None:
        return {"error": "No topic map cached. Refresh first."}

    # Convert sets to lists for JSON serialization
    return {topic: list(diffs) for topic, diffs in TOPIC_MAP_CACHE.items()}
