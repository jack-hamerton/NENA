
from pydantic import BaseModel
from typing import Optional
import datetime

# Shared properties
class PostBase(BaseModel):
    content: str

# Properties to receive on post creation
class PostCreate(PostBase):
    pass

# Properties to receive on post update
class PostUpdate(PostBase):
    content: Optional[str] = None

# Properties to return to client
class Post(PostBase):
    id: int
    author_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True
