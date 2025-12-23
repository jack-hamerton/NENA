
from pydantic import BaseModel, HttpUrl
import uuid
from datetime import datetime
from typing import List, Optional

class PostBase(BaseModel):
    content: str
    media_url: Optional[HttpUrl] = None
    audience_control: str = 'everyone'

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    parent_post_id: Optional[uuid.UUID] = None
    is_following: bool = False

    class Config:
        orm_mode = True
