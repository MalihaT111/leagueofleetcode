# backend/src/history/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from src.history.models import MatchHistory
from src.history.schemas import UserStatsResponse, RecentMatch

async def calculate_user_stats(db: AsyncSession, user_id: int) -> UserStatsResponse:
    # Fetch all matches involving the user
    result = await db.execute(
        select(MatchHistory)
        .where(or_(MatchHistory.user_id == user_id, MatchHistory.opponent_user_id == user_id))
        .order_by(MatchHistory.match_id)
    )
    matches = result.scalars().all()

    if not matches:
        return UserStatsResponse(
            matches_won=0,
            win_rate=0.0,
            win_streak=0,
            recent_matches=[]
        )

    total_matches = len(matches)
    wins = 0

    # Count wins
    for m in matches:
        if (m.user_id == user_id and m.game_status == "win") or \
           (m.opponent_user_id == user_id and m.game_status == "loss"):
            wins += 1

    # Compute win rate
    win_rate = round((wins / total_matches) * 100, 2)

    # Compute win streak (from latest to earliest)
    streak = 0
    for m in reversed(matches):
        if (m.user_id == user_id and m.game_status == "win") or \
           (m.opponent_user_id == user_id and m.game_status == "loss"):
            streak += 1
        else:
            break

    # Prepare recent matches (e.g. last 5)
    recent_matches = []
    for m in reversed(matches[-5:]):
        if m.user_id == user_id:
            outcome = m.game_status
            rating_change = m.elo_change
        else:
            # invert perspective if user was opponent
            outcome = "win" if m.game_status == "lose" else "lose"
            rating_change = -m.elo_change

        recent_matches.append(
            RecentMatch(
                outcome=outcome,
                rating_change=rating_change,
                question=m.leetcode_problem
            )
        )

    # Return full stats response
    return UserStatsResponse(
        matches_won=wins,
        win_rate=win_rate,
        win_streak=streak,
        recent_matches=recent_matches
    )
