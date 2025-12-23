
from typing import List, Optional
from pydantic import BaseModel

class PollOptionBase(BaseModel):
    text: str

class PollOptionCreate(PollOptionBase):
    pass

class PollOption(PollOptionBase):
    id: int
    poll_id: int

    class Config:
        orm_mode = True

class PollBase(BaseModel):
    question: str

class PollCreate(PollBase):
    options: List[PollOptionCreate]

class Poll(PollBase):
    id: int
    episode_id: int
    options: List[PollOption] = []

    class Config:
        orm_mode = True

class PollVoteBase(BaseModel):
    option_id: int

class PollVoteCreate(PollVoteBase):
    pass

class PollVote(PollVoteBase):
    id: int
    poll_id: int
    user_id: int

    class Config:
        orm_mode = True
