
from typing import List, Optional
from pydantic import BaseModel

class ShortcutBase(BaseModel):
    label: str
    url: str

class ShortcutCreate(ShortcutBase):
    pass

class Shortcut(ShortcutBase):
    id: int
    episode_id: int

    class Config:
        orm_mode = True

class EpisodeBase(BaseModel):
    title: str
    description: Optional[str] = None
    audio_url: str
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None

class EpisodeCreate(EpisodeBase):
    pass

class Episode(EpisodeBase):
    id: int
    podcast_id: int
    transcription: Optional[str] = None
    shortcuts: List[Shortcut] = []

    class Config:
        orm_mode = True

class PodcastBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_art_url: Optional[str] = None

class PodcastCreate(PodcastBase):
    pass

class Podcast(PodcastBase):
    id: int
    creator_id: int
    episodes: List[Episode] = []

    class Config:
        orm_mode = True

class PodcastUpdate(PodcastBase):
    pass
