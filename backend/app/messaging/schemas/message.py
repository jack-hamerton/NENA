from pydantic import BaseModel
from datetime import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    recipient_id: int

class MessageUpdate(MessageBase):
    pass

class MessageInDBBase(MessageBase):
    id: int
    timestamp: datetime
    sender_id: int
    conversation_id: int

    class Config:
        orm_mode = True

class Message(MessageInDBBase):
    pass

class MessageInDB(MessageInDBBase):
    pass
