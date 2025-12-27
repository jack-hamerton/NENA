from pydantic import BaseModel, UUID4
from datetime import datetime
from enum import Enum

class IntentEnum(str, Enum):
    COLLABORATOR = "Collaborator"
    MENTOR = "Mentor"
    PEER = "Peer"

class FollowerBase(BaseModel):
    follower_id: UUID4
    followed_id: UUID4


class FollowerCreate(FollowerBase):
    intent: IntentEnum


class Follower(FollowerBase):
    id: UUID4
    created_at: datetime
    intent: IntentEnum

    class Config:
        orm_mode = True
