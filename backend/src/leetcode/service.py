import httpx
from typing import List, Optional
from .schemas import Problem, UserSubmission, ProblemStats, SyncResult
from .enums.difficulties import DifficultyEnum
import random


class LeetCodeService:
    BASE_URL = "https://leetcode.com/graphql"
    
    @staticmethod
    async def _make_graphql_request(query: str, variables: dict = None):
        """Make GraphQL request to LeetCode API"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                LeetCodeService.BASE_URL,
                json={"query": query, "variables": variables or {}},
                headers={"Content-Type": "application/json",
                         "Referer": "https://leetcode.com",}
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
    
    #not working
    @staticmethod
    async def get_user_submissions(username: str):
        """Get user's recent submissions"""
        query = """
        query recentSubmissions($username: String!) {
          recentSubmissions(username: $username) {
            title
            titleSlug
            statusDisplay
            lang
            timestamp
          }
        }
        """

        variables = {"username": username}
        print(variables)
        data = await LeetCodeService._make_graphql_request(query, variables)

        print(submissions)
        submissions = data["data"]["recentSubmissions"]
        return submissions

    
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
    
    async def get_random_problem(
        self, difficulty: Optional[DifficultyEnum] = None
    ) -> Problem:
        """Fetch a random LeetCode problem, optionally filtered by difficulty"""
        query = """
        query problemsetQuestionList(
            $categorySlug: String,
            $skip: Int,
            $limit: Int,
            $filters: QuestionListFilterInput
        ) {
            problemsetQuestionList: questionList(
                categorySlug: $categorySlug,
                skip: $skip,
                limit: $limit,
                filters: $filters
            ) {
                total: totalNum
                questions: data {
                    questionFrontendId
                    title
                    titleSlug
                    difficulty
                }
            }
        }
        """

        variables = {
            "categorySlug": "",
            "skip": 0,
            "limit": 200,   # pull a chunk of problems
            "filters": {
                "tags": [],
                **({"difficulty": difficulty.value} if difficulty else {})
            }
        }

        data = await self._make_graphql_request(query, variables)
        questions = data["data"]["problemsetQuestionList"]["questions"]

        if not questions:
            raise ValueError("No problems found with the given filters.")

        return random.choice(questions)