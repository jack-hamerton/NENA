
from pydantic import BaseModel
import datetime

class ChallengeBase(BaseModel):
    description: str

class ChallengeCreate(ChallengeBase):
    collaboration_id: int

class Challenge(ChallengeBase):
    id: int
    creator_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True

class MitigationBase(BaseModel):
    description: str

class MitigationCreate(MitigationBase):
    challenge_id: int

class Mitigation(MitigationBase):
    id: int
    creator_id: int
    created_at: datetime.datetime

    class Config:
        orm_mode = True
