
from typing import List, Optional, Dict, Any
import uuid
from collections import Counter

from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from app.crud.base import CRUDBase
from app.models.post import Post
from app.models.hashtag import Hashtag
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

    def get_multi_by_owner_and_hashtags(
        self, db: Session, *, user_id: uuid.UUID, hashtags: List[str], skip: int = 0, limit: int = 100
    ) -> List[Post]:
        """
        Get posts by a specific user that contain any of the given hashtags.
        """
        return (
            db.query(self.model)
            .join(Post.hashtags)
            .filter(Post.user_id == user_id, Hashtag.text.in_(hashtags))
            .order_by(Post.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_posts_with_hashtags_by_user(self, db: Session, *, user_id: uuid.UUID) -> int:
        """
        Counts the number of posts by a specific user that have at least one hashtag.
        """
        return (
            db.query(Post)
            .join(Post.hashtags)
            .filter(Post.user_id == user_id)
            .distinct()
            .count()
        )

    def count_hashtags_by_user(self, db: Session, *, user_id: uuid.UUID) -> int:
        """
        Counts the total number of hashtags used by a specific user.
        """
        return (
            db.query(func.count(Hashtag.id))
            .join(Post.hashtags)
            .filter(Post.user_id == user_id)
            .scalar()
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

    def get_user_hashtag_metrics(self, db: Session, *, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        posts = self.get_multi_by_owner(db, user_id=user_id)
        hashtags = []
        for post in posts:
            for hashtag in post.hashtags:
                hashtags.append(hashtag.tag)

        hashtag_counts = Counter(hashtags)
        top_hashtags = hashtag_counts.most_common(5)

        return [{"tag": tag, "count": count} for tag, count in top_hashtags]

post = CRUDPost(Post)
