from pydantic import BaseModel
import uuid
from typing import List
import datetime

class FeedPollOptionBase(BaseModel):
    text: str

class FeedPollOptionCreate(FeedPollOptionBase):
    pass

class FeedPollOption(FeedPollOptionBase):
    id: int
    votes: int

    class Config:
        orm_mode = True

class FeedPollBase(BaseModel):
    question: str
    options: List[FeedPollOptionCreate]
    duration: int
    anonymous: bool

class FeedPollCreate(FeedPollBase):
    user_id: int

class FeedPoll(FeedPollBase):
    id: int
    user_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True

class FeedPollVoteBase(BaseModel):
    option_id: int

class FeedPollVoteCreate(FeedPollVoteBase):
    feed_poll_id: int
    user_id: int

class FeedPollVote(FeedPollVoteBase):
    id: int
    feed_poll_id: int
    user_id: int

    class Config:
        orm_mode = True
