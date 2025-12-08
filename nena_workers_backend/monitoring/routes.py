
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from nena_workers_backend.monitoring.connection_manager import manager

router = APIRouter()

@router.get("/app-status")
def get_app_status():
    return {"status": "ok"}

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Message text was: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client left the chat")
