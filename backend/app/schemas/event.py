from typing import Optional, List
from pydantic import BaseModel
from .event_participant import EventParticipant

# Shared properties
class EventBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None

# Properties to receive on event creation
class EventCreate(EventBase):
    title: str
    start_time: str
    end_time: str

# Properties to receive on event update
class EventUpdate(EventBase):
    pass

# Properties shared by models in DB
class EventInDBBase(EventBase):
    id: int
    title: str
    owner_id: int
    participants: List[EventParticipant] = []

    class Config:
        orm_mode = True

# Properties to return to client
class Event(EventInDBBase):
    pass

# Properties properties stored in DB
class EventInDB(EventInDBBase):
    pass
