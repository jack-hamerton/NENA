from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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
    pass


# Properties to return to client
class Post(PostBase):
    id: int
    author: User
    created_at: datetime
    is_bookmarked: bool = False

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
