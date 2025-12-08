
import asyncio
from typing import Dict, List

import aioredis
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.redis_pool = None

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

        if not self.redis_pool:
            self.redis_pool = await aioredis.create_redis_pool("redis://localhost")

        # Subscribe to the room's channel
        pubsub = self.redis_pool.pubsub()
        await pubsub.subscribe(f"room:{room_id}")

        # Listen for messages and broadcast them to the room's websockets
        async def reader(channel):
            async for message in channel.iter():
                await self.broadcast(room_id, message.decode())

        asyncio.create_task(reader(pubsub))

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id].remove(websocket)

    async def broadcast(self, room_id: str, message: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)

    async def get_room_size(self, room_id: str) -> int:
        if not self.redis_pool:
            self.redis_pool = await aioredis.create_redis_pool("redis://localhost")

        return await self.redis_pool.pubsub_numsub(f"room:{room_id}")


manager = ConnectionManager()
