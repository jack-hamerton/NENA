from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class StudySession:
    id: str
    title: str
    description: str
    hostId: str
    startTime: datetime
    duration: int  # in minutes
    category: str
    tags: List[str]
    participantIds: List[str]
    isLive: bool = False

@dataclass
class StudyMaterial:
    id: str
    sessionId: str
    title: str
    type: str # 'pdf', 'video', 'link'
    url: str
    uploadedAt: datetime
