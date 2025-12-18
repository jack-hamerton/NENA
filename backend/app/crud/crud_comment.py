
from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.schemas.comment import CommentCreate


def get_comments_by_podcast(db: Session, podcast_id: int):
    return db.query(Comment).filter(Comment.podcast_id == podcast_id).all()


def create_comment(db: Session, comment: CommentCreate, user_id: int, podcast_id: int):
    db_comment = Comment(**comment.dict(), user_id=user_id, podcast_id=podcast_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
