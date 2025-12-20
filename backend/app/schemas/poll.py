from pydantic import BaseModel
import uuid
from typing import List

class PollOptionBase(BaseModel):
    text: str

class PollOptionCreate(PollOptionBase):
    pass

class PollOption(PollOptionBase):
    id: uuid.UUID
    votes: int

    class Config:
        orm_mode = True

class PollBase(BaseModel):
    options: List[PollOptionCreate]

class PollCreate(PollBase):
    pass

class Poll(PollBase):
    id: uuid.UUID
    post_id: uuid.UUID

    class Config:
        orm_mode = True
