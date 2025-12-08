from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import message as crud_message
from app.schemas import message as schema_message
from app.core.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/{recipient_id}", response_model=List[schema_message.Message])
def read_messages(
    recipient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    return crud_message.get_messages(db, sender_id=current_user.id, recipient_id=recipient_id, skip=skip, limit=limit)

@router.post("/", response_model=schema_message.Message)

def create_message(
    message: schema_message.MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_message.create_message(db=db, message=message, sender_id=current_user.id)
