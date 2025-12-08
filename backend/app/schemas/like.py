from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Shared properties
class LikeBase(BaseModel):
    post_id: int
    user_id: int


# Properties to receive on item creation
class LikeCreate(LikeBase):
    pass


# Properties to return to client
class Like(LikeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
