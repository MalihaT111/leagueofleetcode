"""
LeetCode module
---------------
Handles all logic related to LeetCode API integration, including:
- Fetching problem data
- Fetching user submissions and stats
- Enumerations for problem difficulties
- Routes and schemas for FastAPI endpoints
"""

from .routes import leetcode_router
from .service import LeetCodeService
from .schemas import Problem, UserSubmission, ProblemStats, SyncResult
from .enums.difficulty import DifficultyEnum

__all__ = [
    "leetcode_router",
    "LeetCodeService",
    "Problem",
    "UserSubmission",
    "ProblemStats",
    "SyncResult",
    "DifficultyEnum",
]