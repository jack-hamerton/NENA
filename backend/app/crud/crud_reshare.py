
from app.crud.base import CRUDBase
from app.models.reshare import Reshare
from app.schemas.reshare import ReshareCreate, ReshareUpdate
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
import uuid


class CRUDReshare(CRUDBase[Reshare, ReshareCreate, ReshareUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: ReshareCreate, user_id: uuid.UUID, post_id: uuid.UUID
    ) -> Reshare:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, user_id=user_id, post_id=post_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


reshare = CRUDReshare(Reshare)
