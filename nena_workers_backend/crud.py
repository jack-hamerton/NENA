
from sqlalchemy.orm import Session
from models import Message
import schemas

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
