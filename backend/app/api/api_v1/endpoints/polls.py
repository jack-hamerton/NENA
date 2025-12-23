
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Poll)
def create_poll(
    *,
    db: Session = Depends(deps.get_db),
    poll_in: schemas.PollCreate,
    episode_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Create new poll.
    """
    poll = crud.poll.create_poll(db=db, poll=poll_in, episode_id=episode_id)
    return poll


@router.get("/{poll_id}", response_model=schemas.Poll)
def read_poll(
    *,
    db: Session = Depends(deps.get_db),
    poll_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get poll by ID.
    """
    poll = crud.poll.get_poll(db=db, poll_id=poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll


@router.post("/{poll_id}/vote", response_model=schemas.PollVote)
def vote_poll(
    *,
    db: Session = Depends(deps.get_db),
    poll_id: int,
    option_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Vote on a poll.
    """
    return crud.poll.vote_poll(
        db=db, poll_id=poll_id, option_id=option_id, user_id=current_user.id
    )


@router.get("/{poll_id}/results", response_model=Any)
def read_poll_results(
    *,
    db: Session = Depends(deps.get_db),
    poll_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get poll results.
    """
    results = crud.poll.get_poll_results(db=db, poll_id=poll_id)
    if results is None:
        raise HTTPException(status_code=404, detail="Poll not found")
    return results
