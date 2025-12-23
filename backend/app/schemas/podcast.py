
from typing import List, Optional
from pydantic import BaseModel, Field
from .comment import CommentWithReplies
from .poll import Poll

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
    notes: Optional[str] = None

class Episode(EpisodeBase):
    id: int
    podcast_id: int
    transcription: Optional[str] = None
    notes: Optional[str] = None
    shortcuts: List[Shortcut] = []
    comments: List[CommentWithReplies] = []
    polls: List[Poll] = []

    class Config:
        orm_mode = True

class PodcastFollower(BaseModel):
    user_id: int
    podcast_id: int

    class Config:
        orm_mode = True

class PodcastBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_art_url: Optional[str] = Field(None, alias='imageUrl')
    category: Optional[str] = None
    is_featured: Optional[bool] = False
    region: Optional[str] = None

class PodcastCreate(PodcastBase):
    pass

class Podcast(PodcastBase):
    id: int
    creator_id: int
    creator: str
    episodes: List[Episode] = []
    followers: List[PodcastFollower] = []
    recommendations: List["Podcast"] = []

    class Config:
        orm_mode = True

class PodcastUpdate(PodcastBase):
    pass

Podcast.update_forward_refs() # Handles the self-referencing in `recommendations`
