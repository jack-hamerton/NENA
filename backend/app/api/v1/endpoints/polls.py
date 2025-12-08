from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/rooms/{room_id}/polls", response_model=schemas.PollInDB)
def create_poll_in_room(
    room_id: int,
    *, 
    db: Session = Depends(deps.get_db),
    poll_in: schemas.PollCreate
):
    """
    Create a new poll in a specific room.
    """
    room = crud.room.get(db, id=room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    poll = crud.poll.create(db, obj_in=poll_in)
    return poll


@router.post("/rooms/{room_id}/polls/{poll_id}/vote")
def vote_in_poll_in_room(
    room_id: int,
    poll_id: int,
    *, 
    db: Session = Depends(deps.get_db),
    vote_in: schemas.PollVoteCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Vote in a poll within a specific room.
    """
    room = crud.room.get(db=db, id=room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    poll = crud.poll.get(db=db, id=poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    # TODO: Add logic to check if the poll belongs to the room.

    vote_in.user_id = current_user.id
    vote_in.poll_id = poll_id
    crud.poll_vote.create(db, obj_in=vote_in)
    return {"message": "Vote recorded"}
