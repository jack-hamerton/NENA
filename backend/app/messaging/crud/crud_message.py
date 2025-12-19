from app.crud.base import CRUDBase
from app.messaging.models.message import Message
from app.messaging.schemas.message import MessageCreate, MessageUpdate

class CRUDMessage(CRUDBase[Message, MessageCreate, MessageUpdate]):
    pass

message = CRUDMessage(Message)
