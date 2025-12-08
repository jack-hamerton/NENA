
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schemas
import crud
from deps import get_db
from nena_workers_backend.monitoring.connection_manager import manager

router = APIRouter()

@router.post("/messages/", response_model=schemas.Message)
async def create_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    db_message = crud.create_message(db=db, message=message)
    await manager.broadcast(f"{db_message.content}")
    return db_message
