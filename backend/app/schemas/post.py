
from pydantic import BaseModel, field_validator
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum
from .user import User
from .hashtag import Hashtag
import uuid

class Audience(str, Enum):
    PUBLIC = "public"
    INFLUENCERS = "influencers"
    STAKEHOLDERS = "stakeholders"

class PostBase(BaseModel):
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    audience: Optional[Audience] = Audience.PUBLIC

class PostUpdate(PostBase):
    audience: Optional[Audience] = None

class PostInDBBase(PostBase):
    id: uuid.UUID
    author_id: uuid.UUID
    created_at: datetime
    audience: Audience

    class Config:
        from_attributes = True

class Post(PostInDBBase):
    author: User
    likes: int

    @field_validator("likes", mode="before")
    @classmethod
    def normalize_likes(cls, v: Any) -> int:
        if isinstance(v, list):
            return len(v)
        if v is None:
            return 0
        return int(v)

class PostInDB(PostInDBBase):
    pass
