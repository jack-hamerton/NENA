
from pydantic import BaseModel
import uuid

class EventParticipantBase(BaseModel):
    event_id: uuid.UUID
    user_id: uuid.UUID
    status: str = "pending"


class EventParticipantCreate(EventParticipantBase):
    pass


class EventParticipantUpdate(EventParticipantBase):
    pass


class EventParticipantInDBBase(EventParticipantBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class EventParticipant(EventParticipantInDBBase):
    pass
