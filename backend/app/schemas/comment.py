from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Shared properties
class CommentBase(BaseModel):
    text: str


# Properties to receive on item creation
class CommentCreate(CommentBase):
    pass


# Properties to return to client
class Comment(CommentBase):
    id: int
    post_id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True
