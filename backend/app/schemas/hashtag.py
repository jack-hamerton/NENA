
from pydantic import BaseModel

class HashtagBase(BaseModel):
    tag: str

class HashtagCreate(HashtagBase):
    pass

class HashtagUpdate(HashtagBase):
    pass

class HashtagInDB(HashtagBase):
    id: int

    class Config:
        orm_mode = True

class Hashtag(HashtagInDB):
    pass

class HashtagMetrics(BaseModel):
    hashtag: str
    post_count: int
