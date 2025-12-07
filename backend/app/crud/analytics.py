from sqlalchemy.orm import Session
from app.models.analytics import UserEngagementView, PostEngagementView

def get_user_engagement(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserEngagementView).offset(skip).limit(limit).all()

def get_post_engagement(db: Session, skip: int = 0, limit: int = 100):
    return db.query(PostEngagementView).offset(skip).limit(limit).all()
