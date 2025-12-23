from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from datetime import datetime

from app import crud, schemas, models
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.get("/events", response_model=List[schemas.Event])
def read_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Retrieve user's events, including those they own and those they are a collaborator on.
    """
    events = crud.calendar.get_events_for_user(db, user_id=current_user.id)
    return events

@router.post("/", response_model=schemas.Event)
def create_event(
    *, 
    db: Session = Depends(get_db),
    event_in: schemas.EventCreate,
    current_user: models.User = Depends(get_current_user),
) -> Any:
    """
    Create new event, checking for conflicts with the owner and any collaborator.
    """
    user_ids_to_check = [current_user.id] + event_in.collaborator_ids
    conflicting_user = None

    for user_id in user_ids_to_check:
        conflict = crud.calendar.find_conflicting_event(db, user_id=user_id, start_time=event_in.start_time, end_time=event_in.end_time)
        if conflict:
            conflicting_user = crud.user.get(db, id=user_id)
            break

    if conflicting_user:
        available_slots = crud.calendar.get_available_slots(db, user_ids=user_ids_to_check, start_time=event_in.start_time)
        raise HTTPException(status_code=409, detail={
            "message": f"{conflicting_user.username} is committed at that time of the day. Kindly try these available slots",
            "available_slots": available_slots
        })

    event = crud.calendar.create_with_participants(db, obj_in=event_in, owner_id=current_user.id, participant_ids=event_in.collaborator_ids)
    return event
