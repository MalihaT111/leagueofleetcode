# src/matchmaking/manager.py
import aioredis
from sqlalchemy.orm import Session
from ..database.models import User
from ..matchmaking.service import create_match_record

MATCHMAKING_KEY = "matchmaking_queue"
REDIS_URL = "redis://localhost:6379"  # Use Elasticache endpoint in production

class MatchmakingManager:
    def __init__(self):
        self.redis = None

    async def connect(self):
        if not self.redis:
            self.redis = await aioredis.from_url(REDIS_URL, decode_responses=True)
        return self.redis

    async def add_player(self, user_id: int, elo: int):
        redis = await self.connect()
        await redis.zadd(MATCHMAKING_KEY, {user_id: elo})

    async def remove_player(self, user_id: int):
        redis = await self.connect()
        await redis.zrem(MATCHMAKING_KEY, user_id)

    async def find_match(self, user_id: int, elo: int, db: Session):
        redis = await self.connect()

        # Look for nearby players within ±100 ELO
        candidates = await redis.zrangebyscore(MATCHMAKING_KEY, elo - 100, elo + 100)

        for opp_id in candidates:
            opp_id = int(opp_id)
            if opp_id == user_id:
                continue

            # Remove both players from queue
            await redis.zrem(MATCHMAKING_KEY, user_id, opp_id)

            # Retrieve opponent info from DB
            opp = db.query(User).filter(User.user_id == opp_id).first()
            user = db.query(User).filter(User.user_id == user_id).first()

            if not opp or not user:
                continue

            # Create match record
            match = create_match_record(db, user, opp)
            return {
                "match_id": match.match_id,
                "opponent": opp.username,
                "opponent_elo": opp.user_elo
            }

        return None
