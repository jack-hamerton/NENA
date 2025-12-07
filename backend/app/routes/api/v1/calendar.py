from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app import schemas
from app.routes import deps
from app.db import models

router = APIRouter()

@router.get("/", response_model=List[schemas.Event])
def read_events(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Retrieve user's events.
    """
    events = crud.calendar.event.get_multi_for_user(db, user_id=current_user.id)
    return events

@router.post("/", response_model=schemas.Event)
def create_event(
    *, 
    db: Session = Depends(deps.get_db),
    event_in: schemas.EventCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Create a new event.
    """
    event = crud.calendar.event.create_with_owner(db, obj_in=event_in, owner_id=current_user.id)
    return event

@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    *, 
    db: Session = Depends(deps.get_db),
    event_id: int,
    event_in: schemas.EventUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Update an event.
    """
    event = crud.calendar.event.get(db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event = crud.calendar.event.update(db, db_obj=event, obj_in=event_in)
    return event

@router.post("/{event_id}/collaborators", response_model=schemas.EventCollaborator)
def add_collaborator(
    *, 
    db: Session = Depends(deps.get_db),
    event_id: int,
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Add a collaborator to an event.
    """
    event = crud.calendar.event.get(db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    collaborator = crud.calendar.event.get_collaborator(db, event_id=event_id, user_id=user_id)
    if collaborator:
        raise HTTPException(status_code=400, detail="Collaborator already added")
    collaborator = crud.calendar.event.add_collaborator(db, event_id=event_id, user_id=user_id)
    return collaborator

@router.put("/{event_id}/collaborators/{user_id}", response_model=schemas.EventCollaborator)
def update_collaborator_status(
    *, 
    db: Session = Depends(deps.get_db),
    event_id: int,
    user_id: int,
    status: str, # pending, accepted, declined
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Update a collaborator's status.
    """
    collaborator = crud.calendar.event.get_collaborator(db, event_id=event_id, user_id=user_id)
    if not collaborator:
        raise HTTPException(status_code=404, detail="Participant not found")
    if collaborator.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    collaborator = crud.calendar.event.update_collaborator_status(db, event_id=event_id, user_id=user_id, status=status)
    return collaborator
