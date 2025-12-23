
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app import crud, models, schemas
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.Room)
def create_room(
    *, 
    db: Session = Depends(get_db),
    room_in: schemas.RoomCreate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """Create new room."""
    room = crud.room.create_with_creator(db=db, obj_in=room_in, creator_id=current_user.id)
    return room

@router.get("/{room_id}", response_model=schemas.Room)
def get_room(
    *, 
    db: Session = Depends(get_db),
    room_id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """Get room by ID."""
    room = crud.room.get(db=db, id=room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room
