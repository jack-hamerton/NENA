from pydantic import BaseModel
from typing import List, Optional
import datetime

class PollBase(BaseModel):
    question: str
    options: List[str]
    duration_minutes: int

class PollCreate(PollBase):
    pass

class PollUpdate(PollBase):
    pass

class PollInDB(PollBase):
    id: int
    post_id: Optional[int] = None
    room_id: Optional[int] = None
    created_at: datetime.datetime

    class Config:
        orm_mode = True
