from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .poll import Poll, PollCreate

# User schema for embedding in Post
class User(BaseModel):
    id: int
    full_name: str
    profile_picture_url: Optional[str] = None

    class Config:
        orm_mode = True

# Shared properties
class PostBase(BaseModel):
    text: str
    media_url: Optional[str] = None


# Properties to receive on item creation
class PostCreate(PostBase):
    poll: Optional[PollCreate] = None


# Properties to return to client
class Post(PostBase):
    id: int
    author: User
    created_at: datetime
    is_bookmarked: bool = False
    poll: Optional[Poll] = None

    class Config:
        orm_mode = True

# Properties for bookmarks
class BookmarkBase(BaseModel):
    post_id: int
    user_id: int

class BookmarkCreate(BookmarkBase):
    pass

class Bookmark(BookmarkBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
