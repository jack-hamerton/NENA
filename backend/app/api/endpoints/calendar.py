from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any

from app import crud, schemas, models
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Event])
def read_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Retrieve user's events.
    """
    events = crud.calendar.get_multi_by_owner(db, owner_id=current_user.id)
    return events

@router.post("/", response_model=schemas.Event)
def create_event(
    *, 
    db: Session = Depends(get_db),
    event_in: schemas.EventCreate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Create new event.
    """
    event = crud.calendar.create_with_owner(db, obj_in=event_in, owner_id=current_user.id)
    return event

@router.put("/{id}", response_model=schemas.Event)
def update_event(
    *, 
    db: Session = Depends(get_db),
    id: int,
    event_in: schemas.EventUpdate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Update an event.
    """
    event = crud.calendar.get(db, id=id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event = crud.calendar.update(db, db_obj=event, obj_in=event_in)
    return event

@router.delete("/{id}", response_model=schemas.Event)
def delete_event(
    *, 
    db: Session = Depends(get_db),
    id: int,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Delete an event.
    """
    event = crud.calendar.get(db, id=id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event = crud.calendar.remove(db, id=id)
    return event
