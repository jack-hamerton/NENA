
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.post import Hashtag
from app.schemas.hashtag import HashtagCreate, HashtagUpdate

class CRUDHashtag(CRUDBase[Hashtag, HashtagCreate, HashtagUpdate]):
    def get_or_create(self, db: Session, *, tag: str) -> Hashtag:
        instance = db.query(Hashtag).filter(Hashtag.tag == tag).first()
        if instance:
            return instance
        else:
            return self.create(db, obj_in=HashtagCreate(tag=tag))

hashtag = CRUDHashtag(Hashtag)
