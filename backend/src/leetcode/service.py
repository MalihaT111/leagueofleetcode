import httpx
from typing import List, Optional
from .schemas import Problem, UserSubmission, ProblemStats, SyncResult
from .enums.difficulty import DifficultyEnum
from .queries import *
import json
import html
from datetime import datetime


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
    async def get_problem(slug: str) -> Problem:
        variables = {"titleSlug": slug}
        data_detail = await LeetCodeService._make_graphql_request(PROBLEM_QUERY, variables)

        q = data_detail["data"]["question"]

        stats = json.loads(q.get("stats", "{}"))
        acceptance_rate = stats.get("acRate", "0%")
        
        raw_content = q.get("content", "")
        decoded_content = html.unescape(raw_content) if raw_content else None
        
        print(q)
        problem = Problem(
            id=int(q["questionId"]),
            title=q["title"],
            slug=q["titleSlug"],
            difficulty=q["difficulty"],
            tags=[tag["name"] for tag in q.get("topicTags", [])],
            acceptance_rate=acceptance_rate,
            content=decoded_content,
        )
        return problem

    # need to reimplement 
    @staticmethod
    async def get_user_submissions(username: str, limit: int = 15) -> List[UserSubmission]:
        """Get user's recent accepted submissions"""
        query = RECENT_AC_SUBMISSIONS_QUERY

        variables = {"username": username, "limit": limit}

        data = await LeetCodeService._make_graphql_request(query, variables)

        submissions = data["data"]["recentAcSubmissionList"]
        
        result = []
        for sub in submissions:
            mapped = {
                "id": int(sub["id"]),
                "problem_id": int(sub["id"]),
                "problem_title": sub["title"],
                "status": sub["statusDisplay"],
                "language": sub["lang"],
                "submitted_at": datetime.fromtimestamp(int(sub["timestamp"])),
                "runtime": sub["runtime"],
                "memory": sub["memory"],
            }
            result.append(UserSubmission(**mapped))        

        return result

    # move to another folder
    @staticmethod
    async def get_user_stats(username: str) -> ProblemStats:
        """Get user's LeetCode statistics"""
        # TODO: gets user information from the endpoint `/api/user/$username`
        pass
    
    @staticmethod
    async def sync_user_progress(user_id: int, leetcode_username: str) -> SyncResult:
        """Sync user's LeetCode progress to database"""
        # TODO: Implement progress synchronization
        # 
        pass
    
    @staticmethod
    async def get_random_problem(difficulty: DifficultyEnum) -> Problem:
        response = await LeetCodeService._make_graphql_request(RANDOM_QUESTION_QUERY)
        
        randomSlug = response["data"]["randomQuestionV2"]["titleSlug"]
        print(randomSlug)
        
        problem_response = await LeetCodeService.get_problem(randomSlug)
        
        return problem_response
    @staticmethod
    async def get_random_problem(difficulty: DifficultyEnum) -> Problem:
        response = await LeetCodeService._make_graphql_request(RANDOM_QUESTION_QUERY)
        
        randomSlug = response["data"]["randomQuestionV2"]["titleSlug"]
        print(randomSlug)
        
        problem_response = await LeetCodeService.get_problem(randomSlug)
        
        return problem_response