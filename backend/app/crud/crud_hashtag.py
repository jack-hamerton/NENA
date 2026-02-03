
from typing import List
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.hashtag import Hashtag
from app.schemas.hashtag import HashtagCreate, HashtagUpdate


class CRUDHashtag(CRUDBase[Hashtag, HashtagCreate, HashtagUpdate]):
    def get_or_create(self, db: Session, *, tag: str) -> Hashtag:
        db_obj = db.query(self.model).filter(self.model.text == tag).first()
        if not db_obj:
            db_obj = self.model(text=tag)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj

    def search(self, db: Session, *, query: str, limit: int = 10) -> List[Hashtag]:
        return db.query(self.model).filter(Hashtag.text.ilike(f"%{query}%")).limit(limit).all()


hashtag = CRUDHashtag(Hashtag)
