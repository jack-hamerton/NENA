
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import Dict, List

from app import crud
from app.core.dependencies import get_db

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}
        self.active_connections[room_id][user_id] = websocket

    def disconnect(self, room_id: str, user_id: str):
        if room_id in self.active_connections and user_id in self.active_connections[room_id]:
            del self.active_connections[room_id][user_id]

    async def broadcast(self, room_id: str, message: dict, exclude_user_id: str = None):
        if room_id in self.active_connections:
            for user_id, connection in self.active_connections[room_id].items():
                if user_id != exclude_user_id:
                    await connection.send_json(message)

    async def send_personal_message(self, message: dict, room_id: str, user_id: str):
        if room_id in self.active_connections and user_id in self.active_connections[room_id]:
            await self.active_connections[room_id][user_id].send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str, db: Session = Depends(get_db)):
    await manager.connect(websocket, room_id, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")

            if event_type == "join-room":
                crud.room.add_participant(db, room_id=int(room_id), user_id=int(user_id))
                await manager.broadcast(room_id, {"type": "user-joined", "user": {"id": user_id}}, exclude_user_id=user_id)
            
            elif event_type == "leave-room":
                crud.room.remove_participant(db, room_id=int(room_id), user_id=int(user_id))
                await manager.broadcast(room_id, {"type": "user-left", "user": {"id": user_id}}, exclude_user_id=user_id)

            elif event_type == "send-message":
                await manager.broadcast(room_id, {"type": "new-message", "message": data["message"]}, exclude_user_id=user_id)

            elif event_type == "remove-user":
                # Additional logic to check if the user is the room creator would be needed here
                removed_user_id = data["user_id"]
                crud.room.remove_participant(db, room_id=int(room_id), user_id=int(removed_user_id))
                await manager.send_personal_message({"type": "user-removed"}, room_id, removed_user_id)
                await manager.broadcast(room_id, {"type": "user-left", "user": {"id": removed_user_id}}, exclude_user_id=removed_user_id)
            
            else:
                # Handle WebRTC signaling
                await manager.broadcast(room_id, data, exclude_user_id=user_id)

    except WebSocketDisconnect:
        manager.disconnect(room_id, user_id)
        crud.room.remove_participant(db, room_id=int(room_id), user_id=int(user_id))
        await manager.broadcast(room_id, {"type": "user-left", "user": {"id": user_id}})
