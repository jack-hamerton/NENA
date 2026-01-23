
from pydantic import BaseModel
from typing import Optional
import uuid

class CollaborationBase(BaseModel):
    title: str
    description: Optional[str] = None
    work_type: Optional[str] = None

class CollaborationCreate(CollaborationBase):
    pass

class Collaboration(CollaborationBase):
    id: uuid.UUID
    creator_id: uuid.UUID

    class Config:
        from_attributes = True
