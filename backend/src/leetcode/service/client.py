# src/leetcode/service/client.py
import httpx

class LeetCodeGraphQLClient:
    BASE_URL = "https://leetcode.com/graphql"

    @staticmethod
    async def query(query: str, variables: dict = None):
        """Send a GraphQL query to LeetCode and return JSON data."""
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                LeetCodeGraphQLClient.BASE_URL,
                json={"query": query, "variables": variables or {}},
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            data = response.json()
            return data
