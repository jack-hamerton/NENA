from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app import schemas
from app.core import deps
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[schemas.Event])
def read_events(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Retrieve user's events.
    """
    events = crud.calendar.get_events_for_user(db, user_id=current_user.id)
    return events

@router.post("/", response_model=schemas.Event)
def create_event(
    *,
    db: Session = Depends(deps.get_db),
    event_in: schemas.EventCreate,
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Create a new event.
    """
    event = crud.calendar.create_with_participants(db, obj_in=event_in, owner_id=current_user.id, participant_ids=[])
    return event

@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: int,
    event_in: schemas.EventUpdate,
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Update an event.
    """
    event = crud.calendar.get(db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event = crud.calendar.update(db, db_obj=event, obj_in=event_in)
    return event

