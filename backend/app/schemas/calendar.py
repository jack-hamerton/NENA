
from typing import Optional, List
from pydantic import BaseModel
import datetime
import uuid

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime.datetime
    end_time: datetime.datetime

class EventCreate(EventBase):
    collaborator_ids: Optional[List[uuid.UUID]] = []

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime.datetime] = None
    end_time: Optional[datetime.datetime] = None
    collaborator_ids: Optional[List[uuid.UUID]] = []

class Event(EventBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    collaborators: List["UserSchema"] = [] # You might need a User schema

    class Config:
        from_attributes = True

# You might need to create a User schema to avoid circular dependencies
from .user import User

class UserSchema(BaseModel):
    id: uuid.UUID
    username: str

    class Config:
        from_attributes = True

Event.update_forward_refs()
