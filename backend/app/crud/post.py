
from typing import List
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models import Post, User, Hashtag
from app.schemas import PostCreate, PostUpdate


class CRUDPost(CRUDBase[Post, PostCreate, PostUpdate]):
    def create_with_owner(self, db: Session, *, obj_in: PostCreate, user_id: int) -> Post:
        db_obj = Post(**obj_in.dict(), author_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Post]:
        return (
            db.query(self.model)
            .filter(Post.author_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_excluding_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 20
    ) -> List[Post]:
        return (
            db.query(self.model)
            .filter(Post.author_id != user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_hashtag(self, db: Session, *, hashtag: str) -> List[Post]:
        return db.query(self.model).join(self.model.hashtags).filter(Hashtag.tag == hashtag).all()

    def get_posts_with_follow_status(
        self, db: Session, *, user_id: int, posts: List[Post]
    ) -> List[Post]:
        # This is not the most performant way to do this, but it's fine for now
        # In a real app, you would want to optimize this
        for post in posts:
            author = db.query(User).filter(User.id == post.author_id).first()
            is_following = any(user for user in author.followers if user.id == user_id)
            post.author.is_following = is_following
        return posts


post = CRUDPost(Post)
