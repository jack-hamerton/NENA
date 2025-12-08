
from typing import List

from backend.app import schemas
from backend.app.db.models import Post, User, Follower, Bookmark
from sqlalchemy.orm import Session


def create_post(db: Session, post_in: schemas.PostCreate, owner: User) -> Post:
    """
    Create a new post.
    """
    db_post = Post(**post_in.dict(), owner_id=owner.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def get_following_feed(db: Session, user: User) -> List[Post]:
    """
    Get the feed for the users that the current user is following.
    """
    followed_user_ids = db.query(Follower.followed_id).filter(Follower.follower_id == user.id).all()
    followed_user_ids = [item[0] for item in followed_user_ids]

    return db.query(Post).filter(Post.owner_id.in_(followed_user_ids)).order_by(Post.created_at.desc()).all()

def get_trending_topics(db: Session):
    """
    This is a placeholder for the real implementation.
    In a real-world application, this would be a more complex algorithm.
    """
    # For now, let's return the most recent posts with hashtags
    return db.query(Post).filter(Post.text.like('%#%')).order_by(Post.created_at.desc()).limit(10).all()

def bookmark_post(db: Session, post_id: int, user: User):
    """
    Bookmark a post.
    """
    db_bookmark = Bookmark(post_id=post_id, user_id=user.id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark

def unbookmark_post(db: Session, post_id: int, user: User):
    """
    Unbookmark a post.
    """
    db_bookmark = db.query(Bookmark).filter(Bookmark.post_id == post_id, Bookmark.user_id == user.id).first()
    if db_bookmark:
        db.delete(db_bookmark)
        db.commit()
    return db_bookmark
