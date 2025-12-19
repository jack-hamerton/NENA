from pydantic import BaseModel
from typing import List
from app.schemas.user import User

class ConversationBase(BaseModel):
    pass

class ConversationCreate(ConversationBase):
    participant_ids: List[int]

class ConversationUpdate(ConversationBase):
    pass

class ConversationInDBBase(ConversationBase):
    id: int
    participants: List[User] = []

    class Config:
        orm_mode = True

class Conversation(ConversationInDBBase):
    pass

class ConversationInDB(ConversationInDBBase):
    pass
