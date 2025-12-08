
from sqlalchemy.orm import Session
import models
import schemas

def create_message(db: Session, message: schemas.MessageCreate, author_id: int, room_id: int):
    db_message = models.Message(**message.dict(), author_id=author_id, room_id=room_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
