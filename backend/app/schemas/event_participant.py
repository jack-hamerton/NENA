from pydantic import BaseModel


class EventParticipantBase(BaseModel):
    event_id: int
    user_id: int
    status: str = "pending"


class EventParticipantCreate(EventParticipantBase):
    pass


class EventParticipantUpdate(EventParticipantBase):
    pass


class EventParticipantInDBBase(EventParticipantBase):
    id: int

    class Config:
        orm_mode = True


class EventParticipant(EventParticipantInDBBase):
    pass
