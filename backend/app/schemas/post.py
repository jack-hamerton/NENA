
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .user import User
from .hashtag import Hashtag

class PostBase(BaseModel):
    content: str

class PostCreate(PostBase):
    pass

class PostUpdate(PostBase):
    pass

class PostInDBBase(PostBase):
    id: int
    author_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class Post(PostInDBBase):
    author: User
    likes: int
    has_liked: bool
    hashtags: List[Hashtag] = []

class PostInDB(PostInDBBase):
    pass
