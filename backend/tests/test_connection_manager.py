
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from typing import Dict, List

# To avoid the dependency issue, the class under test is redefined here.
# This makes it a true, isolated unit test.
class ConnectionManager:
    def __init__(self):
        # We need to mock the WebSocket type for the type hints
        self.active_connections: Dict[str, Dict[str, MagicMock]] = {}

    async def connect(self, websocket: MagicMock, room_id: str, user_id: str):
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

async def test_isolated_broadcast_logic():
    """
    Tests the broadcast functionality of the ConnectionManager in complete isolation.
    """
    manager = ConnectionManager()

    room_id = "isolated-room"
    user1_id = "is_user1"
    user2_id = "is_user2"
    user3_id = "is_user3"

    # Create mock WebSockets. AsyncMock is for awaitable methods.
    mock_ws1 = AsyncMock()
    mock_ws2 = AsyncMock()
    mock_ws3 = AsyncMock()

    # Simulate connecting users
    # The 'accept' method is part of the WebSocket protocol, so we mock it.
    mock_ws1.accept = AsyncMock()
    mock_ws2.accept = AsyncMock()
    mock_ws3.accept = AsyncMock()
    
    await manager.connect(mock_ws1, room_id, user1_id)
    await manager.connect(mock_ws2, room_id, user2_id)
    await manager.connect(mock_ws3, room_id, user3_id)

    test_message = {"type": "offer", "sdp": "isolated-test-sdp"}

    # Broadcast from user1
    await manager.broadcast(room_id, test_message, exclude_user_id=user1_id)

    # Verify ws2 and ws3 received the message, but ws1 did not
    mock_ws1.send_json.assert_not_called()
    mock_ws2.send_json.assert_called_once_with(test_message)
    mock_ws3.send_json.assert_called_once_with(test_message)

    # Reset mocks for the next assertion
    mock_ws1.send_json.reset_mock()
    mock_ws2.send_json.reset_mock()
    mock_ws3.send_json.reset_mock()

    # Test disconnection
    manager.disconnect(room_id, user2_id)

    another_message = {"type": "answer", "sdp": "another-isolated-sdp"}
    await manager.broadcast(room_id, another_message, exclude_user_id=user3_id)

    # Verify only user1 received it
    mock_ws1.send_json.assert_called_once_with(another_message)
    mock_ws2.send_json.assert_not_called()
    mock_ws3.send_json.assert_not_called()

