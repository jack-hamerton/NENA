
from typing import List

from backend.app import schemas
from backend.app.db.models import Post, User, followers, Bookmark, Poll
from sqlalchemy.orm import Session


def create_post(db: Session, post_in: schemas.PostCreate, owner: User) -> Post:
    """
    Create a new post.
    """
    post_data = post_in.dict(exclude={"poll"})
    db_post = Post(**post_data, owner_id=owner.id)

    if post_in.poll:
        poll_data = post_in.poll.dict()
        db_poll = Poll(**poll_data)
        db_post.poll = db_poll

    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def get_following_feed(db: Session, user: User) -> List[Post]:
    """
    Get the feed for the users that the current user is following.
    """
    followed_user_ids = db.query(followers.c.followed_id).filter(followers.c.follower_id == user.id).all()
    followed_user_ids = [item[0] for item in followed_user_ids]

    posts = db.query(Post).filter(Post.author_id.in_(followed_user_ids)).order_by(Post.created_at.desc()).all()

    # Check if each post is bookmarked by the user
    for post in posts:
        post.is_bookmarked = db.query(Bookmark).filter(Bookmark.post_id == post.id, Bookmark.user_id == user.id).first() is not None

    return posts

def get_for_you_feed(db: Session, user: User) -> List[Post]:
    """
    This is a placeholder for the real implementation.
    In a real-world application, this would be a more complex algorithm.
    """
    # For now, let's return the most recent posts, excluding the user's own posts
    posts = db.query(Post).filter(Post.author_id != user.id).order_by(Post.created_at.desc()).limit(20).all()

    # Check if each post is bookmarked by the user
    for post in posts:
        post.is_bookmarked = db.query(Bookmark).filter(Bookmark.post_id == post.id, Bookmark.user_id == user.id).first() is not None

    return posts

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
