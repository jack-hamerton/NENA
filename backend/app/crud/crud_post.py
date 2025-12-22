
from typing import List, Optional, Dict, Any
import uuid

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate


class CRUDPost(CRUDBase[Post, PostCreate, PostUpdate]):
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
            .order_by(Post.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_by_owners(
        self, db: Session, *, user_ids: List[uuid.UUID], skip: int = 0, limit: int = 100
    ) -> List[Post]:
        return (
            db.query(self.model)
            .filter(Post.user_id.in_(user_ids))
            .order_by(Post.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_multi_excluding_owner(
        self, db: Session, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Post]:
        return (
            db.query(self.model)
            .filter(Post.user_id != user_id)
            .order_by(Post.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(self, db: Session, *, db_obj: Post, obj_in: Dict[str, Any]) -> Post:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def search(self, db: Session, *, query: str, limit: int = 10) -> List[Post]:
        return db.query(self.model).filter(Post.content.ilike(f"%{query}%")).limit(limit).all()

post = CRUDPost(Post)
