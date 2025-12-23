
from app.crud.base import CRUDBase
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import uuid


class CRUDComment(CRUDBase[Comment, CommentCreate, CommentUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: CommentCreate, user_id: uuid.UUID, post_id: uuid.UUID
    ) -> Comment:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, user_id=user_id, post_id=post_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_post(
        self, db: Session, *, post_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Comment]:
        return (
            db.query(self.model)
            .filter(Comment.post_id == post_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


comment = CRUDComment(Comment)
