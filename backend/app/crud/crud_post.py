
from typing import List, Optional
import uuid

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.post import Post
from app.schemas.post import PostCreate


class CRUDPost(CRUDBase[Post, PostCreate, PostCreate]):
    def create_with_owner(
        self, db: Session, *, obj_in: PostCreate, user_id: uuid.UUID
    ) -> Post:
        db_obj = self.model(**obj_in.dict(), user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Post]:
        return (
            db.query(self.model)
            .filter(Post.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


post = CRUDPost(Post)
