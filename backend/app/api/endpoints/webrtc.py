
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle signaling messages
            if data["type"] == "call-user":
                await manager.send_personal_message({
                    "type": "call-made",
                    "offer": data["offer"],
                    "from": user_id
                }, data["to"])
            elif data["type"] == "make-answer":
                await manager.send_personal_message({
                    "type": "answer-made",
                    "answer": data["answer"],
                    "from": user_id
                }, data["to"])
            elif data["type"] == "ice-candidate":
                await manager.send_personal_message({
                    "type": "ice-candidate",
                    "candidate": data["candidate"],
                    "from": user_id
                }, data["to"])
            elif data["type"] == "reject-call":
                await manager.send_personal_message({
                    "type": "call-rejected",
                    "from": user_id
                }, data["to"])
            elif data["type"] == "end-call":
                await manager.send_personal_message({
                    "type": "call-ended",
                    "from": user_id
                }, data["to"])
    except WebSocketDisconnect:
        manager.disconnect(user_id)
