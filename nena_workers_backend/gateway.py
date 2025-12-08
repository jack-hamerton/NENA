
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        # A mapping of room IDs to a dictionary of user IDs and their WebSockets
        self.rooms: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = {}
        self.rooms[room_id][user_id] = websocket

    def disconnect(self, websocket: WebSocket, room_id: str, user_id: str):
        if room_id in self.rooms and user_id in self.rooms[room_id]:
            del self.rooms[room_id][user_id]
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast_to_room(self, room_id: str, message: str, exclude_user_id: str = None):
        if room_id in self.rooms:
            for user_id, connection in self.rooms[room_id].items():
                if user_id != exclude_user_id:
                    await connection.send_text(message)

    async def send_to_user(self, room_id: str, user_id: str, message: str):
        if room_id in self.rooms and user_id in self.rooms[room_id]:
            await self.rooms[room_id][user_id].send_text(message)

manager = ConnectionManager()

async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await manager.connect(websocket, room_id, user_id)
    # Announce that a new user has joined
    await manager.broadcast_to_room(room_id, json.dumps({"event": "user-joined-room", "data": {"userId": user_id, "roomId": room_id}}), exclude_user_id=user_id)

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            event = message.get("event")
            payload = message.get("data", {})

            # WebRTC Signaling Logic
            if event in ["offer", "answer", "ice-candidate"]:
                to_user = payload.get("to")
                if to_user:
                    # Forward the message to the specific user
                    await manager.send_to_user(room_id, to_user, json.dumps({"event": event, "data": payload}))
            
            # Add other event handling here as needed

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id, user_id)
        # Announce that a user has left
        await manager.broadcast_to_room(room_id, json.dumps({"event": "user-left-room", "data": {"userId": user_id, "roomId": room_id}}))
