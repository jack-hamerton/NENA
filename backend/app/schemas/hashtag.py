
from pydantic import BaseModel
import uuid
from typing import Optional


class HashtagBase(BaseModel):
    text: str


class HashtagCreate(HashtagBase):
    pass


class HashtagUpdate(HashtagBase):
    pass


class HashtagInDBBase(HashtagBase):
    id: uuid.UUID

    class Config:
        orm_mode = True


class Hashtag(HashtagInDBBase):
    pass
