from fastapi import HTTPException
import httpx
from typing import List, Optional
from src.leetcode.service.client import LeetCodeGraphQLClient
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats, SyncResult
from src.leetcode.enums.difficulty import DifficultyEnum
from src.leetcode.service.graphql_queries import *

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
        response = await LeetCodeGraphQLClient.query(RANDOM_QUESTION_QUERY)
        
        randomSlug = response["data"]["randomQuestionV2"]["titleSlug"]
        print(randomSlug)
        
        problem_response = await LeetCodeService.get_problem(randomSlug)
        
        return problem_response