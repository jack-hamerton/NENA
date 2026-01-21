
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .user import User
from .hashtag import Hashtag

class Audience(str, Enum):
    PUBLIC = "public"
    INFLUENCERS = "influencers"
    STAKEHOLDERS = "stakeholders"

class PostBase(BaseModel):
    content: str

class PostCreate(PostBase):
    audience: Optional[Audience] = Audience.PUBLIC

class PostUpdate(PostBase):
    audience: Optional[Audience] = None

class PostInDBBase(PostBase):
    id: int
    author_id: int
    created_at: datetime
    audience: Audience

    class Config:
        orm_mode = True

class Post(PostInDBBase):
    author: User
    likes: int

class PostInDB(PostInDBBase):
    pass
