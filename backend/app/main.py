
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.endpoints import (
    notifications as notifications_router,
    podcasts as podcasts_router,
    webrtc as webrtc_router,
    room as room_router,
)
from app.ai.services import ai_service
from app.reminders import start_scheduler
from app.websockets import manager

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.on_event("startup")
def startup_event():
    start_scheduler()

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router.router, prefix="/notifications", tags=["notifications"])
app.include_router(podcasts_router.router, prefix="/api/podcasts", tags=["podcasts"])
app.include_router(webrtc_router.router, prefix="/api/webrtc", tags=["webrtc"])
app.include_router(room_router.router, prefix="/api/rooms", tags=["rooms"])


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data['type'] == 'webrtc-offer':
                await manager.send_personal_message({
                    "type": "webrtc-offer",
                    "offer": data['offer'],
                    "from": user_id
                }, data['to'])
            elif data['type'] == 'webrtc-answer':
                await manager.send_personal_message({
                    "type": "webrtc-answer",
                    "answer": data['answer'],
                    "from": user_id
                }, data['to'])
            elif data['type'] == 'webrtc-ice-candidate':
                await manager.send_personal_message({
                    "type": "webrtc-ice-candidate",
                    "candidate": data['candidate'],
                    "from": user_id
                }, data['to'])
    except WebSocketDisconnect:
        manager.disconnect(user_id)
