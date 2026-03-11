from datetime import datetime
from dataclasses import dataclass, asdict
from typing import List, Optional

@dataclass
class Comment:
    id: str
    postId: str
    authorId: str
    content: str
    createdAt: str

    def to_dict(self):
        return asdict(self)

@dataclass
class Post:
    id: str
    authorId: str
    title: str
    content: str
    likesCount: int = 0
    dislikesCount: int = 0
    commentCount: int = 0
    createdAt: str = datetime.utcnow().isoformat()
    imageUrl: Optional[str] = None

    def to_dict(self):
        return asdict(self)
