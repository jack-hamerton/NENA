from pydantic import BaseModel
from typing import Optional
import datetime

class MessageBase(BaseModel):
    content: str
    message_type: Optional[str] = 'text'
    media_url: Optional[str] = None
    is_disappearing: Optional[bool] = False
    disappearing_duration: Optional[int] = None
    is_view_once: Optional[bool] = False
    is_encrypted: Optional[bool] = False
    parent_message_id: Optional[int] = None

class MessageCreate(MessageBase):
    recipient_id: int

class Message(MessageBase):
    id: int
    sender_id: int
    recipient_id: int
    sent_at: datetime.datetime

    class Config:
        orm_mode = True
