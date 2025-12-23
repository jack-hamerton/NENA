
from typing import List, Optional
from pydantic import BaseModel, Field
import datetime

# ... existing Shortcut schemas ...

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    episode_id: int
    parent_comment_id: Optional[int] = None

class CommentUpdate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    user_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True

class CommentWithReplies(Comment):
    replies: List["CommentWithReplies"] = []

# ... existing Episode and Podcast schemas ...
