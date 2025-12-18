
from pydantic import BaseModel, HttpUrl
from typing import Optional

class PodcastBase(BaseModel):
    title: str
    artist_name: str
    description: str
    s3_key: str
    cover_art_url: Optional[HttpUrl] = None

class PodcastCreate(PodcastBase):
    pass

class Podcast(PodcastBase):
    id: int
    creator_id: int

    class Config:
        orm_mode = True
