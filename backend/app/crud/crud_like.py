
from app.crud.base import CRUDBase
from app.models.like import Like
from app.schemas.like import LikeCreate, LikeUpdate
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import uuid


class CRUDLike(CRUDBase[Like, LikeCreate, LikeUpdate]):
    def get_by_post_and_user(
        self, db: Session, *, post_id: uuid.UUID, user_id: uuid.UUID
    ) -> Like | None:
        return (
            db.query(self.model)
            .filter(Like.post_id == post_id, Like.user_id == user_id)
            .first()
        )

    def create_with_owner(
        self, db: Session, *, obj_in: LikeCreate, user_id: uuid.UUID, post_id: uuid.UUID
    ) -> Like:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, user_id=user_id, post_id=post_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


like = CRUDLike(Like)
