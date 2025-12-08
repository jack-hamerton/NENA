from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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
    owner_id: int
    created_at: datetime

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
