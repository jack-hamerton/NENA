
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
from app.websocket_manager import websocket_manager

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


@app.websocket("/ws/study/{study_id}")
async def websocket_endpoint(websocket: WebSocket, study_id: int):
    await websocket_manager.connect(websocket, study_id)
    try:
        while True:
            # The backend will listen for messages, but for now, we just keep the connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket, study_id)
