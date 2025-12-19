from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.api import deps
from app.services.notification import NotificationService
from app.schemas.notification import Notification, NotificationCreate
from typing import List
import uuid

router = APIRouter()
notification_service = NotificationService()


@router.post("/", response_model=Notification)
def create_notification(
    notification_in: NotificationCreate,
    db: Session = Depends(deps.get_db),
):
    return notification_service.create_notification(db=db, notification_in=notification_in)


@router.get("/{user_id}", response_model=List[Notification])
def get_notifications(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    return notification_service.get_notifications_by_user(db=db, user_id=user_id)


@router.put("/{notification_id}/read", response_model=Notification)
def mark_as_read(
    notification_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    return notification_service.mark_notification_as_read(db=db, notification_id=notification_id)


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)


manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # For now, we'll just echo the message back.
            # In a real app, you might handle incoming messages here.
            await manager.send_personal_message(f"You wrote: {data}", user_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        await manager.send_personal_message(f"User {user_id} has left.", user_id)
