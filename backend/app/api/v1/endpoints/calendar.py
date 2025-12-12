from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Event])
def read_events(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> List[models.Event]:
    """
    Retrieve events.
    """
    events = crud.calendar.get_multi_by_owner(
        db=db, owner_id=current_user.id, skip=skip, limit=limit
    )
    return events


@router.post("/", response_model=schemas.Event)
def create_event(
    *, 
    db: Session = Depends(deps.get_db), 
    event_in: schemas.EventCreate, 
    current_user: models.User = Depends(deps.get_current_active_user),
    participant_ids: List[int] = []
) -> models.Event:
    """
    Create new event.
    """
    event = crud.calendar.create_with_owner(db=db, obj_in=event_in, owner_id=current_user.id)
    for user_id in participant_ids:
        crud.event_participant.create(
            db=db, obj_in=schemas.EventParticipantCreate(event_id=event.id, user_id=user_id)
        )
    return event


@router.put("/{id}", response_model=schemas.Event)
def update_event(
    *, 
    db: Session = Depends(deps.get_db), 
    id: int, 
    event_in: schemas.EventUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> models.Event:
    """
    Update an event.
    """
    event = crud.calendar.get(db=db, id=id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not crud.user.is_superuser(current_user) and (event.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event = crud.calendar.update(db=db, db_obj=event, obj_in=event_in)
    return event


@router.put("/invitations/{id}", response_model=schemas.EventParticipant)
def respond_to_invitation(
    *, 
    db: Session = Depends(deps.get_db), 
    id: int, 
    response: str, 
    current_user: models.User = Depends(deps.get_current_active_user)
) -> models.EventParticipant:
    """
    Respond to an invitation.
    """
    event_participant = crud.event_participant.get(db=db, id=id)
    if not event_participant:
        raise HTTPException(status_code=404, detail="Invitation not found")
    if event_participant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event_participant = crud.event_participant.update(
        db=db, db_obj=event_participant, obj_in=schemas.EventParticipantUpdate(status=response)
    )
    return event_participant


@router.delete("/{id}", response_model=schemas.Event)
def delete_event(
    *, 
    db: Session = Depends(deps.get_db), 
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> models.Event:
    """
    Delete an event.
    """
    event = crud.calendar.get(db=db, id=id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not crud.user.is_superuser(current_user) and (event.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    event = crud.calendar.remove(db=db, id=id)
    return event
