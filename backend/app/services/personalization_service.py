from typing import List
from sqlalchemy.orm import Session

from backend.app.db.models import Post, User


def get_personalized_feed(db: Session, user: User) -> List[Post]:
    """
    This function will contain the logic for personalizing the user's feed.
    It will take into account the user's likes, reposts, and interactions.
    """
    # This is a placeholder implementation.
    # The actual implementation would involve a more complex algorithm.
    return db.query(Post).order_by(Post.created_at.desc()).all()
