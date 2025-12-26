# backend/app/websocket_manager.py
from typing import Dict, List
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        # A dictionary to hold active connections, with study_id as the key
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, study_id: int):
        """Accepts a new WebSocket connection and adds it to the list for a study."""
        await websocket.accept()
        if study_id not in self.active_connections:
            self.active_connections[study_id] = []
        self.active_connections[study_id].append(websocket)

    def disconnect(self, websocket: WebSocket, study_id: int):
        """Removes a WebSocket connection from the list."""
        if study_id in self.active_connections:
            self.active_connections[study_id].remove(websocket)
            if not self.active_connections[study_id]:
                del self.active_connections[study_id]

    async def broadcast_to_study(self, study_id: int, message: dict):
        """Sends a JSON message to all clients connected for a specific study."""
        if study_id in self.active_connections:
            for connection in self.active_connections[study_id]:
                await connection.send_json(message)

# Create a single instance of the manager to be used across the application
websocket_manager = WebSocketManager()
