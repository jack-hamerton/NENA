from sqlalchemy.orm import Session
from app.models.message import Message
from app.schemas.message import MessageCreate

def get_messages(db: Session, sender_id: int, recipient_id: int, skip: int = 0, limit: int = 100):
    return db.query(Message).filter(
        ((Message.sender_id == sender_id) & (Message.recipient_id == recipient_id)) |
        ((Message.sender_id == recipient_id) & (Message.recipient_id == sender_id))
    ).offset(skip).limit(limit).all()

def create_message(db: Session, message: MessageCreate, sender_id: int):
    db_message = Message(
        **message.dict(),
        sender_id=sender_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
