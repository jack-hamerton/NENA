
import asyncio
import json
from fastapi import WebSocket, WebSocketDisconnect
import aioredis

# This will be our global Redis connection pool
redis = None

async def get_redis():
    """Initializes and returns the Redis connection pool."""
    global redis
    if redis is None:
        redis = await aioredis.from_url("redis://localhost", encoding="utf-8", decode_responses=True)
    return redis

class ConnectionManager:
    async def publish(self, channel: str, message: str):
        """Publishes a message to a Redis channel."""
        redis_conn = await get_redis()
        await redis_conn.publish(channel, message)

manager = ConnectionManager()

async def reader(channel, websocket: WebSocket):
    """Listens for messages on a Redis channel and sends them to the client."""
    async with (await get_redis()).pubsub() as pubsub:
        await pubsub.subscribe(channel)
        async for message in pubsub.listen():
            if message["type"] == "message":
                await websocket.send_text(message["data"])

async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await websocket.accept()
    redis_conn = await get_redis()

    # Create a unique channel for this user in this room to receive direct messages
    user_channel = f"room:{room_id}:user:{user_id}"
    # General channel for the room
    room_channel = f"room:{room_id}"

    # Start a task to listen for messages for this user
    reader_task = asyncio.create_task(reader(user_channel, websocket))
    # Start a task to listen for messages for the room
    room_reader_task = asyncio.create_task(reader(room_channel, websocket))

    # Announce that a new user has joined the room
    await manager.publish(room_channel, json.dumps({"event": "user-joined-room", "data": {"userId": user_id, "roomId": room_id}}))

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
                    # Publish the message to the specific user's channel
                    to_user_channel = f"room:{room_id}:user:{to_user}"
                    await manager.publish(to_user_channel, json.dumps({"event": event, "data": {**payload, "from": user_id}}))
            
            # Add other event handling here as needed

    except WebSocketDisconnect:
        # Stop the listener tasks
        reader_task.cancel()
        room_reader_task.cancel()
        # Announce that a user has left
        await manager.publish(room_channel, json.dumps({"event": "user-left-room", "data": {"userId": user_id, "roomId": room_id}}))
    finally:
        # Ensure tasks are cancelled
        if not reader_task.done():
            reader_task.cancel()
        if not room_reader_task.done():
            room_reader_task.cancel()
