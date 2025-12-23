
from sqlalchemy.orm import Session, joinedload
from app import models, schemas

def get_comment(db: Session, comment_id: int):
    return db.query(models.Comment).filter(models.Comment.id == comment_id).first()

def get_comments_for_episode(db: Session, episode_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Comment)
        .options(joinedload(models.Comment.replies))
        .filter(models.Comment.episode_id == episode_id, models.Comment.parent_comment_id.is_(None))
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_comment(db: Session, comment: schemas.CommentCreate, user_id: int):
    db_comment = models.Comment(
        **comment.dict(),
        user_id=user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def update_comment(db: Session, comment_id: int, comment: schemas.CommentUpdate):
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if db_comment:
        for key, value in comment.dict(exclude_unset=True).items():
            setattr(db_comment, key, value)
        db.commit()
        db.refresh(db_comment)
    return db_comment

def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if db_comment:
        db.delete(db_comment)
        db.commit()
    return db_comment
