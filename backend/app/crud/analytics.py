
from sqlalchemy.orm import Session
from app.models import Post, Follow
from app.schemas import PostEngagement, UserEngagement
from datetime import datetime, timedelta

def get_post_engagement(db: Session, user_id: int) -> PostEngagement:
    """Get post engagement analytics for a user."""
    one_week_ago = datetime.utcnow() - timedelta(days=7)

    likes = db.query(Post).filter(Post.owner_id == user_id, Post.created_at > one_week_ago).count()
    comments = db.query(Post).filter(Post.owner_id == user_id, Post.created_at > one_week_ago).count() # This is a placeholder, you'll need a comments model
    reshares = db.query(Post).filter(Post.owner_id == user_id, Post.created_at > one_week_ago).count() # This is a placeholder, you'll need a reshares model

    return PostEngagement(likes=likes, comments=comments, reshares=reshares)

def get_user_engagement(db: Session, user_id: int) -> UserEngagement:
    """Get user engagement analytics for a user."""
    one_week_ago = datetime.utcnow() - timedelta(days=7)

    new_followers = db.query(Follow).filter(Follow.followed_id == user_id, Follow.created_at > one_week_ago).count()
    profile_views = 0 # This is a placeholder, you'll need a profile views model

    return UserEngagement(new_followers=new_followers, profile_views=profile_views)
