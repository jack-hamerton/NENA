
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

# The validated ConnectionManager class
class ConnectionManager:
    def __init__(self):
        # Structure: {room_id: {user_id: websocket}}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}
        self.active_connections[room_id][user_id] = websocket

    def disconnect(self, room_id: str, user_id: str):
        if room_id in self.active_connections and user_id in self.active_connections[room_id]:
            del self.active_connections[room_id][user_id]

    async def broadcast(self, room_id: str, message: dict, exclude_user_id: str):
        if room_id in self.active_connections:
            for user_id, connection in self.active_connections[room_id].items():
                if user_id != exclude_user_id:
                    await connection.send_json(message)


router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    """
    This WebSocket endpoint handles the WebRTC signaling.

    - It accepts a WebSocket connection for a given user in a specific room.
    - It listens for incoming messages (like offers, answers, candidates) and
      broadcasts them to all other participants in the same room.
    - It handles disconnection to clean up the connections.
    """
    await manager.connect(websocket, room_id, user_id)
    try:
        while True:
            # Wait for a message from the client
            data = await websocket.receive_json()
            # Broadcast the received message to others in the room
            await manager.broadcast(room_id, data, exclude_user_id=user_id)
    except WebSocketDisconnect:
        # The client disconnected, so we clean up the connection
        manager.disconnect(room_id, user_id)
        # Optionally, you could broadcast a "user-left" message here
        await manager.broadcast(room_id, {"type": "user-left", "userId": user_id}, exclude_user_id=user_id)

