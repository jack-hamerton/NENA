from typing import Optional
from pydantic import BaseModel
import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime.datetime
    end_time: datetime.datetime

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None

class Event(EventBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
