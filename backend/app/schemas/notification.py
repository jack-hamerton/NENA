
import uuid
from pydantic import BaseModel
from datetime import datetime

class NotificationBase(BaseModel):
    type: str
    payload: dict

class NotificationCreate(NotificationBase):
    user_id: uuid.UUID

class Notification(NotificationBase):
    id: int
    read: bool
    created_at: datetime

    class Config:
        orm_mode = True
