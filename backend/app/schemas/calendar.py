from typing import Optional, List
from pydantic import BaseModel
import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime.datetime
    end_time: datetime.datetime

class EventCreate(EventBase):
    collaborator_ids: Optional[List[int]] = []

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
    collaborator_ids: Optional[List[int]] = []

class Event(EventBase):
    id: int
    owner_id: int
    collaborators: List["UserSchema"] = [] # You might need a User schema

    class Config:
        orm_mode = True

# You might need to create a User schema to avoid circular dependencies
from .user import User

class UserSchema(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

Event.update_forward_refs()
