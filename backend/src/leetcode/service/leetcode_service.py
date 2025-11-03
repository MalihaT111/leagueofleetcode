from fastapi import HTTPException
import httpx
from typing import List, Optional
from src.leetcode.service.client import LeetCodeGraphQLClient
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats, SyncResult
from src.leetcode.enums.difficulty import DifficultyEnum
from src.leetcode.service.graphql_queries import *
import json

class LeetCodeService:
    @staticmethod
    async def get_problem(slug: str) -> Problem:
        data = await LeetCodeGraphQLClient.query(PROBLEM_QUERY, {"titleSlug": slug})
        return data
    
    @staticmethod
    async def get_user_submissions(username: str):
        data = await LeetCodeGraphQLClient.query(RECENT_AC_SUBMISSIONS_QUERY, {"username": username})
        return data["recentAcSubmissionList"]
    
    @staticmethod
    async def get_user_stats(username: str) -> ProblemStats:
        """Get user's LeetCode statistics (Easy, Medium, Hard only)."""
        data = await LeetCodeGraphQLClient.query(QUESTION_STATS_QUERY, {"username": username})

        # LeetCodeGraphQLClient already returns the `data` portion,
        # so you should check inside that structure.
        matched_user = data.get("data",{}).get("matchedUser")

        if not matched_user:
            raise HTTPException(status_code=404, detail=f"User '{username}' not found on LeetCode.")

        # Extract submission stats
        stats = matched_user["submitStats"]["acSubmissionNum"]
        # Filter to only Easy, Medium, Hard
        filtered = {s["difficulty"]: s["count"] for s in stats if s["difficulty"] in ["All", "Easy", "Medium", "Hard"]}

        # Safely get counts (0 if missing)
        total = filtered.get("All", 0)
        easy = filtered.get("Easy", 0)
        medium = filtered.get("Medium", 0)
        hard = filtered.get("Hard", 0)

        return ProblemStats(
            total_solved=total,
            easy_solved=easy,
            medium_solved=medium,
            hard_solved=hard,
        )
    
    @staticmethod
    async def sync_user_progress(user_id: int, leetcode_username: str) -> SyncResult:
        """Sync user's LeetCode progress to database"""
        # TODO: Implement progress synchronization
        pass
    
    @staticmethod
    async def get_random_problem() -> Problem:
        try:
            response = await LeetCodeGraphQLClient.query(RANDOM_QUESTION_QUERY)
            random_slug = response["data"]["randomQuestionV2"]["titleSlug"]

            if not random_slug:
                raise ValueError("LeetCode API returned no titleSlug")

            print(f"Selected random problem: {random_slug}")
            problem_data = await LeetCodeService.get_problem(random_slug)
        except Exception as e:
            print(f"Failed to fetch random problem: {e}")
            return {"error": str(e)}
        
        problem = problem_data["data"]["question"]
        
        stats_data = json.loads(problem["stats"])

        acceptance_rate = stats_data["acRate"]
        
        # return problem
        return Problem(
            id = problem["questionId"],
            title = problem["title"],
            slug = problem["titleSlug"],
            difficulty = problem["difficulty"],
            tags= [tag["name"] for tag in problem["topicTags"]],
            acceptance_rate = acceptance_rate
        )
    
"""
class Problem(BaseModel):
    id: int
    title: str
    slug: str
    difficulty: str
    tags: List[str]
    acceptance_rate: float
    is_premium: bool
    content: Optional[str] = None
"""