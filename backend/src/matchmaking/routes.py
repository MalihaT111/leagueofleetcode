# src/matchmaking/routes.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .service import matchmaker

router = APIRouter()

@router.websocket("/ws/matchmaking")
async def matchmaking_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        user_id = data["user_id"]
        elo = data["elo"]

        matchmaker.add_player(websocket, user_id, elo)

        while True:
            await asyncio.sleep(1)
            match = matchmaker.find_match(user_id, elo)
            if match:
                opponent_ws, opponent_id, _ = match
                await websocket.send_json({"match_found": True, "opponent_id": opponent_id})
                await opponent_ws.send_json({"match_found": True, "opponent_id": user_id})
                matchmaker.remove_player(user_id)
                matchmaker.remove_player(opponent_id)
                break

    except WebSocketDisconnect:
        matchmaker.remove_player(user_id)
