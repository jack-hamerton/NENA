from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.notification import Notification
from app.api.v1.auth import get_current_user
from app.services.notification_service import NotificationService

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # For now, we're just receiving data, not sending any
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.get("", response_model=list[Notification])
def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return NotificationService.get_notifications_for_user(db, current_user.id)

@router.post("/{notification_id}/read")
def mark_notification_as_read(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    NotificationService.mark_as_read(db, notification_id, current_user.id)
    return {"message": "Notification marked as read"}

@router.delete("/read")
def clear_read_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    NotificationService.clear_read(db, current_user.id)
    return {"message": "Read notifications cleared"}
