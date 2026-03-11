from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class Room:
    id: str
    name: str
    description: Optional[str]
    hostId: str
    isLive: bool
    createdAt: datetime
    category: Optional[str]
    thumbnail: Optional[str]

@dataclass
class Participant:
    id: str
    userId: str
    username: str
    role: str # 'host', 'speaker', 'listener'
    isMuted: bool
    isVideoOff: bool
    peerId: Optional[str] = None
