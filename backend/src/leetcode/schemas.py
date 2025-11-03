from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Problem(BaseModel):
    id: int
    title: str
    slug: str
    difficulty: str
    tags: List[str]
    acceptance_rate: str

class UserSubmission(BaseModel):
    id: int
    problem_id: int
    problem_title: str
    status: str
    runtime: Optional[str] = None
    memory: Optional[str] = None
    language: str
    submitted_at: datetime

class ProblemStats(BaseModel):
    total_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int

class SyncResult(BaseModel):
    synced_submissions: int
    updated_stats: ProblemStats
    last_sync: datetime