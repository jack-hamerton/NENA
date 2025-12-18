
from pydantic import BaseModel
import datetime

class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime.datetime
    user_id: int
    podcast_id: int

    class Config:
        orm_mode = True
