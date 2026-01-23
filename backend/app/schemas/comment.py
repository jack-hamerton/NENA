
from typing import List, Optional
from pydantic import BaseModel, Field
import datetime
import uuid

# ... existing Shortcut schemas ...

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    episode_id: uuid.UUID
    parent_comment_id: Optional[uuid.UUID] = None

class CommentUpdate(CommentBase):
    pass

class Comment(CommentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CommentWithReplies(Comment):
    replies: List["CommentWithReplies"] = []

# ... existing Episode and Podcast schemas ...
