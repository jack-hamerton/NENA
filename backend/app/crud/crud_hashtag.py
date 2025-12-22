
from typing import List
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.hashtag import Hashtag
from app.schemas.hashtag import HashtagCreate, HashtagUpdate


class CRUDHashtag(CRUDBase[Hashtag, HashtagCreate, HashtagUpdate]):
    def search(self, db: Session, *, query: str, limit: int = 10) -> List[Hashtag]:
        return db.query(self.model).filter(Hashtag.text.ilike(f"%{query}%")).limit(limit).all()


hashtag = CRUDHashtag(Hashtag)
