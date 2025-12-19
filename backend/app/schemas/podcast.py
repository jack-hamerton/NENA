
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# Shortcut properties
class Shortcut(BaseModel):
    timestamp: str
    url: str


# Podcast properties
class PodcastBase(BaseModel):
    title: str
    description: Optional[str] = None
    artist_name: Optional[str] = None
    category: Optional[str] = "Podcast"


class PodcastCreate(PodcastBase):
    shortcuts: Optional[List[Shortcut]] = None


class PodcastUpdate(PodcastBase):
    pass


class PodcastInDBBase(PodcastBase):
    id: UUID
    user_id: UUID
    cover_art_url: Optional[str] = None
    media_url: str
    video_thumbnail_url: Optional[str] = None
    video_url: Optional[str] = None
    transcription_url: Optional[str] = None
    shortcuts: Optional[List[Shortcut]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Podcast(PodcastInDBBase):
    pass


# Follow properties
class FollowBase(BaseModel):
    podcast_id: UUID


class FollowCreate(FollowBase):
    pass


class FollowInDBBase(FollowBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class Follow(FollowInDBBase):
    pass
