from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas, models
from app.dependencies import get_db, get_current_user
from app.websockets import manager

router = APIRouter()

@router.post("/", response_model=schemas.Event)
async def create_event_with_collaborator(
    *, 
    db: Session = Depends(get_db),
    event_in: schemas.EventCreate,
    collaborator_id: int,
    current_user: models.User = Depends(get_current_user)
):
    """
    Create an event and add a collaborator, checking for availability.
    """
    if crud.event.is_user_busy(db, user_id=collaborator_id, start_time=event_in.start_time, end_time=event_in.end_time):
        available_slots = crud.event.find_available_slots(db, user_id=collaborator_id, date=event_in.start_time.date())
        raise HTTPException(
            status_code=409, # Conflict
            detail={"message": "User is busy at this time.", "available_slots": available_slots}
        )

    event = crud.event.create_with_owner(db, obj_in=event_in, owner_id=current_user.id)
    crud.event.add_collaborator(db, event_id=event.id, user_id=collaborator_id)
    
    # Send notification to the collaborator
    notification = schemas.Notification(
        type="event_invitation",
        payload=schemas.Event.from_orm(event).dict()
    )
    await manager.send_personal_message(notification.dict(), collaborator_id)

    return event

@router.get("/events", response_model=List[schemas.Event])
def get_user_events(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    Retrieve all events for the current user (created and collaborated).
    """
    return crud.event.get_multi_for_user(db, user_id=current_user.id)
