# src/matchmaking/websocket_routes.py
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database.database import get_db
from ..database.models import User
from .websocket_manager import websocket_manager

router = APIRouter()

@router.websocket("/ws/test")
async def test_websocket(websocket: WebSocket):
    """Simple WebSocket test endpoint"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        print("Test WebSocket disconnected")

@router.websocket("/ws/matchmaking/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket endpoint for matchmaking"""
    
    # Accept connection first
    await websocket.accept()
    
    # Get database session manually (WebSocket dependency injection can be tricky)
    from ..database.database import AsyncSessionLocal
    async with AsyncSessionLocal() as db:
        # Verify user exists
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            await websocket.close(code=4004, reason="User not found")
            return

        # Connect user
        await websocket_manager.connect(websocket, user_id)
        
        try:
            while True:
                # Receive messages from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                message_type = message.get("type")
                
                if message_type == "join_queue":
                    await websocket_manager.join_queue(user_id, user.user_elo, db)
                    
                elif message_type == "leave_queue":
                    await websocket_manager.leave_queue(user_id)
                    
                elif message_type == "submit_solution":
                    match_id = message.get("match_id")
                    if match_id:
                        success = await websocket_manager.submit_solution(match_id, user_id, db)
                        if not success:
                            await websocket_manager.send_to_user(user_id, {
                                "type": "error",
                                "message": "Failed to submit solution"
                            })
                            
                elif message_type == "ping":
                    # Heartbeat to keep connection alive
                    await websocket_manager.send_to_user(user_id, {"type": "pong"})
                    
        except WebSocketDisconnect:
            websocket_manager.disconnect(user_id)
        except Exception as e:
            print(f"❌ WebSocket error for user {user_id}: {e}")
            websocket_manager.disconnect(user_id)