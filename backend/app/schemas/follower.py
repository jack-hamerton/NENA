from pydantic import BaseModel, UUID4
from datetime import datetime


class FollowerBase(BaseModel):
    follower_id: UUID4
    followed_id: UUID4


class FollowerCreate(FollowerBase):
    pass


class Follower(FollowerBase):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True
