from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class Episode:
    id: str
    podcastId: str
    title: str
    description: str
    audioUrl: str
    duration: int # in seconds
    releaseDate: datetime
    videoUrl: Optional[str] = None

@dataclass
class Podcast:
    id: str
    title: str
    description: str
    author: str
    authorId: str
    imageUrl: str
    category: str
    episodes: List[Episode]
    createdAt: datetime
    updatedAt: datetime
