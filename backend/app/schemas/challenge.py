from pydantic import BaseModel
import uuid

class ChallengeBase(BaseModel):
    name: str
    description: str | None = None

class ChallengeCreate(ChallengeBase):
    pass

class Challenge(ChallengeBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
