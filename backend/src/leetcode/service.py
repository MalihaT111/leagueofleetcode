import os
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
    COOKIE_FILE = "leetcode_cookies.json"

    @staticmethod
    def _load_cookies() -> Optional[str]:
        """
        Load cookies from JSON file and return as a single header string:
        "csrftoken=<token>; LEETCODE_SESSION=<session>"
        """
        if not os.path.exists(LeetCodeService.COOKIE_FILE):
            print(f"Cookie file not found at {LeetCodeService.COOKIE_FILE}")
            return None

        try:
            with open(LeetCodeService.COOKIE_FILE, "r", encoding="utf-8") as f:
                cookies = json.load(f)

            cookie_dict = {c["name"]: c["value"] for c in cookies if "name" in c and "value" in c}

            csrf = cookie_dict.get("csrftoken")
            session = cookie_dict.get("LEETCODE_SESSION")

            if not csrf or not session:
                print("csrftoken or LEETCODE_SESSION missing in cookie file.")
                return None

            return f"csrftoken={csrf}; LEETCODE_SESSION={session}"

        except Exception as e:
            print(f"Failed to load cookies: {e}")
            return None

    
    @staticmethod
    async def _make_graphql_request(query: str, variables: dict = None, needsAuth: bool = False):
        """Make GraphQL request to LeetCode API"""
        headers = {
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com"
        }
        
        if needsAuth:
            cookies = LeetCodeService._load_cookies()
            headers["Cookie"] = cookies


        async with httpx.AsyncClient() as client:
            response = await client.post(
                LeetCodeService.BASE_URL,
                json={"query": query, "variables": variables or {}},
                headers=headers,
            )
            print('\n\n\n\n\n')
            print(cookies)
            response.raise_for_status()
            data = response.json()
            print('\n\n\n\n\n')
            print(headers)
            
            
            if "errors" in data:
                raise RuntimeError(f"LeetCode API error: {data['errors']}")
            return data


    
    @staticmethod
    async def get_problem(slug: str) -> Problem:
        variables = {"titleSlug": slug}
        data_detail = await LeetCodeService._make_graphql_request(PROBLEM_QUERY, variables)

        q = data_detail["data"]["question"]

        try:
            stats = json.loads(q.get("stats", "{}"))
        except json.JSONDecodeError:
            stats = {}
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
    async def get_submission_details(submission_id: int) -> UserSubmission:
        """Fetch full details of a specific LeetCode submission."""
        variables = {"submissionId": submission_id}

        # Make GraphQL request using the correct query
        response = await LeetCodeService._make_graphql_request(SUBMISSION_DETAILS_QUERY, variables, True)

        # Safely extract data
        # submission = response.get("data", {}).get("submissionDetails")

        # # Handle missing or null data (authentication / invalid submission)
        # if not submission:
        #     raise Exception("Authentication required or submission not found")

        # Map fields from the GraphQL response to your schema
        # mapped = {
        #     "id": int(submission["id"]),
        #     "problem_id": int(submission["question"]["questionId"]),
        #     "problem_title": submission["question"]["title"],
        #     "status": submission["statusDisplay"],
        #     "language": submission["lang"],
        #     "submitted_at": datetime.fromtimestamp(int(submission["timestamp"])),
        #     "runtime": submission.get("runtimeDisplay"),
        #     "runtime_percentile": submission.get("runtimePercentile"),
        #     "memory": submission.get("memoryDisplay"),
        #     "memory_percentile": submission.get("memoryPercentile"),
        #     "code": submission.get("code"),
        # }

        # Return a populated UserSubmission model
        return response
