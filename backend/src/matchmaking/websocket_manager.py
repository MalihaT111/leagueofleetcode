# src/matchmaking/websocket_manager.py
import json
import asyncio
from typing import Dict, Set
from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database.models import User
from .manager import MatchmakingManager
from .service import create_match_record

class WebSocketManager:
    def __init__(self):
        # Store active connections by user_id
        self.active_connections: Dict[int, WebSocket] = {}
        # Store users waiting in queue
        self.queue: Dict[int, dict] = {}  # user_id -> {elo, websocket}
        # Store match problems by match_id
        self.match_problems: Dict[int, dict] = {}
        self.matchmaking_manager = MatchmakingManager()

    async def connect(self, websocket: WebSocket, user_id: int):
        """Store WebSocket connection (already accepted in route)"""
        self.active_connections[user_id] = websocket
        print(f"🔌 User {user_id} connected via WebSocket")

    def disconnect(self, user_id: int):
        """Remove user from connections and queue"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.queue:
            del self.queue[user_id]
        print(f"🔌 User {user_id} disconnected")

    async def send_to_user(self, user_id: int, message: dict):
        """Send message to specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(json.dumps(message))
            except Exception as e:
                print(f"❌ Failed to send message to user {user_id}: {e}")
                # Remove dead connection
                if user_id in self.active_connections:
                    del self.active_connections[user_id]

    async def join_queue(self, user_id: int, user_elo: int, db: AsyncSession):
        """Add user to matchmaking queue"""
        print(f"🚀 User {user_id} joining queue with ELO {user_elo}")
        
        # Add to queue
        self.queue[user_id] = {
            "elo": user_elo,
            "websocket": self.active_connections.get(user_id)
        }

        # Send queue joined confirmation
        await self.send_to_user(user_id, {
            "type": "queue_joined",
            "message": "Searching for opponent..."
        })

        # Try to find a match
        await self.try_match_players(db)

    async def leave_queue(self, user_id: int):
        """Remove user from queue"""
        if user_id in self.queue:
            del self.queue[user_id]
            await self.send_to_user(user_id, {
                "type": "queue_left",
                "message": "Left matchmaking queue"
            })
            print(f"🚪 User {user_id} left queue")

    async def try_match_players(self, db: AsyncSession):
        """Try to match players in queue"""
        if len(self.queue) < 2:
            return

        # Get two players from queue (simple FIFO for now)
        queue_items = list(self.queue.items())
        
        for i in range(len(queue_items)):
            for j in range(i + 1, len(queue_items)):
                user1_id, user1_data = queue_items[i]
                user2_id, user2_data = queue_items[j]
                
                # Check ELO compatibility (±100)
                elo_diff = abs(user1_data["elo"] - user2_data["elo"])
                if elo_diff <= 100:
                    await self.create_match(user1_id, user2_id, db)
                    return

    async def create_match(self, user1_id: int, user2_id: int, db: AsyncSession):
        """Create a match between two users"""
        try:
            # Remove both from queue
            self.queue.pop(user1_id, None)
            self.queue.pop(user2_id, None)

            # Get user data from database
            user1_result = await db.execute(select(User).where(User.id == user1_id))
            user1 = user1_result.scalar_one_or_none()
            
            user2_result = await db.execute(select(User).where(User.id == user2_id))
            user2 = user2_result.scalar_one_or_none()

            if not user1 or not user2:
                print(f"❌ Failed to get user data for match")
                return

            # Create match record
            match_record = await create_match_record(db, user1, user2)
            match = match_record["match"]
            problem = match_record["problem"]

            # Store problem for this match
            self.match_problems[match.match_id] = problem

            print(f"✅ Match created: {match.match_id} between {user1.email} and {user2.email}")

            # Notify both players
            match_data = {
                "type": "match_found",
                "match_id": match.match_id,
                "problem": problem.dict(),
                "opponent": {
                    "username": user2.leetcode_username or user2.email,
                    "elo": user2.user_elo
                }
            }

            await self.send_to_user(user1_id, {
                **match_data,
                "opponent": {
                    "username": user2.leetcode_username or user2.email,
                    "elo": user2.user_elo
                }
            })

            await self.send_to_user(user2_id, {
                **match_data,
                "opponent": {
                    "username": user1.leetcode_username or user1.email,
                    "elo": user1.user_elo
                }
            })

        except Exception as e:
            print(f"❌ Error creating match: {e}")

    async def submit_solution(self, match_id: int, user_id: int, db: AsyncSession):
        """Handle solution submission"""
        from sqlalchemy import select
        from ..database.models import MatchHistory

        # Find the match
        match_result = await db.execute(
            select(MatchHistory).where(MatchHistory.match_id == match_id)
        )
        match = match_result.scalar_one_or_none()

        if not match or match.elo_change != 0:
            return False

        # Determine winner and loser
        if match.winner_id == user_id:
            winner_id = match.winner_id
            loser_id = match.loser_id
        elif match.loser_id == user_id:
            winner_id = match.loser_id
            loser_id = match.winner_id
            # Swap winner/loser in the match record
            match.winner_id = winner_id
            match.loser_id = loser_id
        else:
            return False

        # Update match with problem slug and ELO changes
        problem = self.match_problems.get(match_id)
        if problem:
            match.leetcode_problem = problem.slug

        elo_change = 15
        match.elo_change = elo_change

        # Update user ELOs
        winner_result = await db.execute(select(User).where(User.id == winner_id))
        winner = winner_result.scalar_one_or_none()
        loser_result = await db.execute(select(User).where(User.id == loser_id))
        loser = loser_result.scalar_one_or_none()

        if winner and loser:
            winner.user_elo += elo_change
            loser.user_elo -= elo_change
            match.winner_elo = winner.user_elo
            match.loser_elo = loser.user_elo

        await db.commit()

        # Notify both players
        await self.send_to_user(winner_id, {
            "type": "match_completed",
            "result": "won",
            "match_id": match_id,
            "elo_change": f"+{elo_change}"
        })

        await self.send_to_user(loser_id, {
            "type": "match_completed", 
            "result": "lost",
            "match_id": match_id,
            "elo_change": f"-{elo_change}"
        })

        print(f"🏆 Match {match_id} completed. Winner: {winner_id}, Loser: {loser_id}")
        return True

    async def resign_match(self, match_id: int, user_id: int, db: AsyncSession):
        """Handle match resignation"""
        from sqlalchemy import select
        from ..database.models import MatchHistory

        # Find the match
        match_result = await db.execute(
            select(MatchHistory).where(MatchHistory.match_id == match_id)
        )
        match = match_result.scalar_one_or_none()

        if not match or match.elo_change != 0:
            return False

        # Determine winner and loser (resigning user loses)
        if match.winner_id == user_id:
            # User was winner, now becomes loser
            winner_id = match.loser_id
            loser_id = match.winner_id
            match.winner_id = winner_id
            match.loser_id = loser_id
        elif match.loser_id == user_id:
            # User was loser, stays loser
            winner_id = match.winner_id
            loser_id = match.loser_id
        else:
            return False

        # Update match with problem slug and ELO changes
        problem = self.match_problems.get(match_id)
        if problem:
            match.leetcode_problem = problem.slug

        # ELO changes for resignation: winner gets +15, loser loses -10
        winner_elo_change = 15
        loser_elo_change = 10
        match.elo_change = loser_elo_change

        # Update user ELOs
        winner_result = await db.execute(select(User).where(User.id == winner_id))
        winner = winner_result.scalar_one_or_none()
        loser_result = await db.execute(select(User).where(User.id == loser_id))
        loser = loser_result.scalar_one_or_none()

        if winner and loser:
            winner.user_elo += winner_elo_change
            loser.user_elo -= loser_elo_change
            match.winner_elo = winner.user_elo
            match.loser_elo = loser.user_elo

        await db.commit()

        # Notify both players
        await self.send_to_user(winner_id, {
            "type": "match_completed",
            "result": "won",
            "match_id": match_id,
            "elo_change": f"+{winner_elo_change}",
            "reason": "opponent_resigned"
        })

        await self.send_to_user(loser_id, {
            "type": "match_completed", 
            "result": "lost",
            "match_id": match_id,
            "elo_change": f"-{loser_elo_change}",
            "reason": "resigned"
        })

        print(f"🏳️ Match {match_id} ended by resignation. Winner: {winner_id}, Loser: {loser_id}")
        return True

# Global WebSocket manager instance
websocket_manager = WebSocketManager()