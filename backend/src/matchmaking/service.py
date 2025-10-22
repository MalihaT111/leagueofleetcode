# src/matchmaking/service.py
import asyncio

class Matchmaker:
    def __init__(self):
        self.waiting_players = []  # (websocket, user_id, elo)

    def add_player(self, websocket, user_id, elo):
        self.waiting_players.append((websocket, user_id, elo))

    def remove_player(self, user_id):
        self.waiting_players = [p for p in self.waiting_players if p[1] != user_id]

    def find_match(self, user_id, elo, tolerance=100):
        for ws, oid, oelo in self.waiting_players:
            if oid != user_id and abs(elo - oelo) <= tolerance:
                return (ws, oid, oelo)
        return None

matchmaker = Matchmaker()
