
from pydantic import BaseModel
from typing import Optional
import datetime
import uuid

class MessageBase(BaseModel):
    content: str
    message_type: Optional[str] = 'text'
    media_url: Optional[str] = None
    is_disappearing: Optional[bool] = False
    disappearing_duration: Optional[int] = None
    is_view_once: Optional[bool] = False
    is_encrypted: Optional[bool] = False
    parent_message_id: Optional[uuid.UUID] = None

class MessageCreate(MessageBase):
    recipient_id: uuid.UUID

class Message(MessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    recipient_id: uuid.UUID
    sent_at: datetime.datetime

    class Config:
        orm_mode = True
