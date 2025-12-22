from pydantic import BaseModel
import uuid
from typing import List
import datetime

class PollOptionBase(BaseModel):
    text: str

class PollOptionCreate(PollOptionBase):
    pass

class PollOption(PollOptionBase):
    id: int
    votes: int

    class Config:
        orm_mode = True

class PollBase(BaseModel):
    question: str
    options: List[PollOptionCreate]
    duration: int
    anonymous: bool

class PollCreate(PollBase):
    room_id: int

class Poll(PollBase):
    id: int
    room_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True

class PollVoteBase(BaseModel):
    option_id: int

class PollVoteCreate(PollVoteBase):
    poll_id: int
    # user_id: int

class PollVote(PollVoteBase):
    id: int
    poll_id: int
    # user_id: int

    class Config:
        orm_mode = True
