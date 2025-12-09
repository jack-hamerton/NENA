from pydantic import BaseModel
from typing import List, Optional
import datetime

class PollBase(BaseModel):
    question: str
    options: List[str]
    duration_minutes: Optional[int]

class PollCreate(PollBase):
    pass

class PollUpdate(PollBase):
    pass

class Poll(PollBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class PollInDBBase(Poll):
    pass

class PollInDB(PollInDBBase):
    pass
