# src/matchmaking/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.models import MatchHistory
from ..database.models import User
from ..leetcode.service.leetcode_service import LeetCodeService

TOPIC_MAPPING = [
    "array",
    "string",
    "hash-table",
    "dynamic-programming",
    "math",
    "sorting",
    "greedy",
    "depth-first-search",
    "binary-search",
    "database",
    "matrix",
    "bit-manipulation",
    "tree",
    "breadth-first-search",
    "two-pointers",
    "prefix-sum",
    "heap-priority-queue",
    "simulation",
    "binary-tree",
    "graph",
    "counting",
    "stack",
    "sliding-window",
    "design",
    "enumeration",
    "backtracking",
    "union-find",
    "number-theory",
    "linked-list",
    "ordered-set",
    "monotonic-stack",
    "segment-tree",
    "trie",
    "combinatorics",
    "bitmask",
    "divide-and-conquer",
    "queue",
    "recursion",
    "geometry",
    "binary-indexed-tree",
    "memoization",
    "hash-function",
    "binary-search-tree",
    "shortest-path",
    "string-matching",
    "topological-sort",
    "rolling-hash",
    "game-theory",
    "interactive",
    "data-stream",
    "monotonic-queue",
    "brainteaser",
    "doubly-linked-list",
    "randomized",
    "merge-sort",
    "counting-sort",
    "iterator",
    "concurrency",
    "line-sweep",
    "probability-and-statistics",
    "quickselect",
    "suffix-array",
    "minimum-spanning-tree",
    "bucket-sort",
    "shell",
    "reservoir-sampling",
    "strongly-connected-component",
    "eulerian-circuit",
    "radix-sort",
    "rejection-sampling",
    "biconnected-component",
]

async def create_match_record(db: AsyncSession, user: User, opponent: User):
    from sqlalchemy import or_, delete

    
    # Clean up any existing TBD records for both users
    await db.execute(
        delete(MatchHistory).where(
            or_(
                MatchHistory.winner_id.in_([user.id, opponent.id]),
                MatchHistory.loser_id.in_([user.id, opponent.id])
            )
        ).where(MatchHistory.leetcode_problem == "TBD")
    )

    shared_topics = list(set(user.topics or []) & set(opponent.topics or []))
    shared_difficulty = list(set(user.difficulty or []) & set(opponent.difficulty or []))

    if not shared_topics and not shared_difficulty:
        print(f"⚠️ No overlap between {user.email} and {opponent.email}")
        return None  # stop early — not compatible
    
    topic_slugs = [TOPIC_MAPPING[i] for i in shared_topics if 0 <= i < len(TOPIC_MAPPING)]
    
    problem = await LeetCodeService.get_random_problem(
        topics=topic_slugs or None,
        difficulty=shared_difficulty or None
    )

    if not problem or (isinstance(problem, dict) and "error" in problem):
        print(f"⚠️ Failed to fetch compatible problem for {user.email} & {opponent.email}")
        return None

    match = MatchHistory(
        winner_id=user.id,  # Temporary - will be updated when match completes
        loser_id=opponent.id,  # Temporary - will be updated when match completes
        leetcode_problem="TBD",  # Indicates active/pending match
        elo_change=0,
        winner_elo=user.user_elo,
        loser_elo=opponent.user_elo,
        match_seconds = 0,
        winner_runtime = 0,
        loser_runtime = 0,
        winner_memory = 0.0,
        loser_memory = 0.0
        
    )
    db.add(match)
    await db.commit()
    await db.refresh(match)
    return {"match": match, 
            "problem": problem}
