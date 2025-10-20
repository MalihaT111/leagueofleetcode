import httpx
from typing import List, Optional
from src.leetcode.schemas import Problem, UserSubmission, ProblemStats, SyncResult
from src.leetcode.enums.difficulty import DifficultyEnum
from src.leetcode.queries import *

class LeetCodeService:
    BASE_URL = "https://leetcode.com/graphql"
    
    @staticmethod
    async def _make_graphql_request(query: str, variables: dict = None):
        """Make GraphQL request to LeetCode API"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                LeetCodeService.BASE_URL,
                json={"query": query, "variables": variables or {}},
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
    
    @staticmethod
    async def get_problems(
        difficulty: Optional[str] = None,
        tags: Optional[List[str]] = None,
        limit: int = 50
    ) -> List[Problem]:
        """Get LeetCode problems with filtering"""
        # TODO: Implement GraphQL query for problems
        pass
    
    @staticmethod
    async def get_problem(problem_slug: str) -> Problem:
        """Get specific problem details"""
        # TODO: Implement GraphQL query for single problem
        pass
    
    @staticmethod
    async def get_user_submissions(username: str) -> List[UserSubmission]:
        """Get user's recent submissions"""
        # TODO: Implement GraphQL query for user submissions
        pass
    
    @staticmethod
    async def get_user_stats(username: str) -> ProblemStats:
        """Get user's LeetCode statistics"""
        # TODO: Implement GraphQL query for user stats
        pass
    
    @staticmethod
    async def sync_user_progress(user_id: int, leetcode_username: str) -> SyncResult:
        """Sync user's LeetCode progress to database"""
        # TODO: Implement progress synchronization
        pass
    
    @staticmethod
    async def get_random_problem(difficulty: DifficultyEnum) -> Problem:
        response = await LeetCodeService._make_graphql_request(RANDOM_QUESTION_QUERY)
        
        randomSlug = response["data"]["randomQuestionV2"]["titleSlug"]
        print(randomSlug)
        
        problem_response = await LeetCodeService.get_problem(randomSlug)
        
        return problem_response