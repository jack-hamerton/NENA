from pydantic import BaseModel, UUID4
from datetime import datetime


class NotificationBase(BaseModel):
    type: str
    content: str


class NotificationCreate(NotificationBase):
    user_id: UUID4


class Notification(NotificationBase):
    id: UUID4
    is_read: bool
    created_at: datetime

    class Config:
        orm_mode = True
