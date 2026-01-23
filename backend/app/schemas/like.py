
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

# Shared properties
class LikeBase(BaseModel):
    post_id: uuid.UUID
    user_id: uuid.UUID


# Properties to receive on item creation
class LikeCreate(LikeBase):
    pass


class LikeUpdate(BaseModel):
    pass


# Properties to return to client
class Like(LikeBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True
