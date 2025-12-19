from app.crud.base import CRUDBase
from app.messaging.models.conversation import Conversation
from app.messaging.schemas.conversation import ConversationCreate, ConversationUpdate
from sqlalchemy.orm import Session


class CRUDConversation(CRUDBase[Conversation, ConversationCreate, ConversationUpdate]):
    def get_by_participants(
        self, db: Session, *, user_a_id: int, user_b_id: int
    ) -> Conversation | None:
        return (
            db.query(Conversation)
            .filter(Conversation.participants.any(id=user_a_id))
            .filter(Conversation.participants.any(id=user_b_id))
            .first()
        )


conversation = CRUDConversation(Conversation)
