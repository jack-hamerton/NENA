
from typing import List

from backend.app import schemas
from backend.app.db.models import Like, User
from sqlalchemy.orm import Session


def like_post(db: Session, post_id: int, user: User):
    """
    Like a post.
    """
    db_like = Like(post_id=post_id, user_id=user.id)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like


def unlike_post(db: Session, post_id: int, user: User):
    """
    Unlike a post.
    """
    db_like = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user.id).first()
    if db_like:
        db.delete(db_like)
        db.commit()
    return db_like


def get_likes_for_post(db: Session, post_id: int) -> List[Like]:
    """
    Get all likes for a post.
    """
    return db.query(Like).filter(Like.post_id == post_id).all()
