
from pydantic import BaseModel
from typing import Optional

class CollaborationBase(BaseModel):
    title: str
    description: Optional[str] = None
    work_type: Optional[str] = None

class CollaborationCreate(CollaborationBase):
    pass

class Collaboration(CollaborationBase):
    id: int
    creator_id: int

    class Config:
        orm_mode = True
