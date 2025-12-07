from typing import List, Optional
from pydantic import BaseModel
import datetime
from app.db.models import EventCollaboratorStatus

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime.datetime
    end_time: datetime.datetime

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class Event(EventBase):
    id: int
    creator_id: int

    class Config:
        orm_mode = True

class EventCollaboratorBase(BaseModel):
    event_id: int
    user_id: int
    status: EventCollaboratorStatus

class EventCollaborator(EventCollaboratorBase):
    class Config:
        orm_mode = True
