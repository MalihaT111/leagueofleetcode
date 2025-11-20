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

async def get_completed_problems(db: AsyncSession, user_id: int) -> set:
    """Get all problem slugs that a user has completed"""
    from sqlalchemy import select, or_
    
    # Get all matches where user was winner or loser (excluding TBD matches)
    result = await db.execute(
        select(MatchHistory.leetcode_problem).where(
            or_(
                MatchHistory.winner_id == user_id,
                MatchHistory.loser_id == user_id
            )
        ).where(MatchHistory.leetcode_problem != "TBD")
    )
    
    completed = {row[0] for row in result.fetchall()}
    return completed


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
    
    # Check if either user has repeat disabled
    user_repeat = getattr(user, 'repeating_questions', True)
    opponent_repeat = getattr(opponent, 'repeating_questions', True)
    
    # Get completed problems for users with repeat disabled
    excluded_problems = set()
    if not user_repeat:
        user_completed = await get_completed_problems(db, user.id)
        excluded_problems.update(user_completed)
        print(f"🔄 User {user.email} has repeat OFF - excluding {len(user_completed)} problems")
    
    if not opponent_repeat:
        opponent_completed = await get_completed_problems(db, opponent.id)
        excluded_problems.update(opponent_completed)
        print(f"🔄 Opponent {opponent.email} has repeat OFF - excluding {len(opponent_completed)} problems")

    # If no overlap, use fallback defaults to ensure matches can still be created
    if not shared_topics and not shared_difficulty:
        print(f"⚠️ No overlap between {user.email} and {opponent.email}, using fallback settings")
        # Use medium difficulty and popular topics as fallback
        shared_difficulty = ["2"]  # Medium difficulty
        shared_topics = ["0", "1", "2"]  # Array, String, Hash Table (most common)
    
    # Convert topic indices to topic slugs
    topic_slugs = []
    for topic_idx in shared_topics:
        try:
            idx = int(topic_idx)
            if 0 <= idx < len(TOPIC_MAPPING):
                topic_slugs.append(TOPIC_MAPPING[idx])
        except (ValueError, TypeError):
            continue
    
    # Convert difficulty numbers to difficulty strings
    difficulty_mapping = {"1": "EASY", "2": "MEDIUM", "3": "HARD"}
    difficulty_strings = []
    for diff in shared_difficulty:
        try:
            diff_str = str(diff)
            if diff_str in difficulty_mapping:
                difficulty_strings.append(difficulty_mapping[diff_str])
        except (ValueError, TypeError):
            continue
    
    problem = await LeetCodeService.get_random_problem(
        topics=topic_slugs or None,
        difficulty=difficulty_strings or None,
        excluded_slugs=excluded_problems if excluded_problems else None
    )

    if not problem or (isinstance(problem, dict) and "error" in problem):
        error_msg = problem.get("error", "Unknown error") if isinstance(problem, dict) else "Failed to fetch problem"
        print(f"⚠️ Failed to fetch compatible problem for {user.email} & {opponent.email}: {error_msg}")
        return None

    match = MatchHistory(
        winner_id=user.id,  # Temporary - will be updated when match completes
        loser_id=opponent.id,  # Temporary - will be updated when match completes
        leetcode_problem="TBD",  # Indicates active/pending match
        elo_change=0,
        winner_elo_change=0,  # New: Will be set when match completes
        loser_elo_change=0,   # New: Will be set when match completes
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
