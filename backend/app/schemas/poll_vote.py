from pydantic import BaseModel
import datetime

class PollVoteBase(BaseModel):
    poll_id: int
    option: str

class PollVoteCreate(PollVoteBase):
    pass

class PollVoteUpdate(PollVoteBase):
    pass

class PollVoteInDB(PollVoteBase):
    id: int
    user_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True
