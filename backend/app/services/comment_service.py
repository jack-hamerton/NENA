
from typing import List

from backend.app import schemas
from backend.app.db.models import Comment, User
from sqlalchemy.orm import Session


def create_comment(db: Session, comment_in: schemas.CommentCreate, owner: User, post_id: int) -> Comment:
    """
    Create a new comment.
    """
    db_comment = Comment(**comment_in.dict(), owner_id=owner.id, post_id=post_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def get_comments_for_post(db: Session, post_id: int) -> List[Comment]:
    """
    Get all comments for a post.
    """
    return db.query(Comment).filter(Comment.post_id == post_id).all()
