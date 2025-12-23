from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate
from typing import List

class CRUDMessage(CRUDBase[Message, MessageCreate, MessageUpdate]):
    def get_multi_by_conversation(
        self, db: Session, *, conversation_id: int, skip: int = 0, limit: int = 100
    ) -> List[Message]:
        return (
            db.query(self.model)
            .filter(Message.conversation_id == conversation_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

message = CRUDMessage(Message)
