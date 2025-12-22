from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.core.deps import get_db

router = APIRouter()


@router.post("/feed-polls", response_model=schemas.FeedPoll)
def create_feed_poll(
    *, 
    db: Session = Depends(get_db),
    poll_in: schemas.FeedPollCreate
):
    """
    Create a new feed poll.
    """
    poll = crud.feed_poll.create(db, obj_in=poll_in)
    return poll


@router.post("/feed-polls/{poll_id}/vote")
def vote_in_feed_poll(
    poll_id: int,
    *, 
    db: Session = Depends(get_db),
    vote_in: schemas.FeedPollVoteCreate,
    # current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Vote in a feed poll.
    """
    poll = crud.feed_poll.get(db=db, id=poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    # vote_in.user_id = current_user.id
    vote_in.feed_poll_id = poll_id
    crud.feed_poll_vote.create(db, obj_in=vote_in)
    
    # Recalculate poll results
    results = crud.feed_poll.get_results(db, feed_poll_id=poll_id)

    return {"message": "Vote recorded", "results": results}

@router.get("/feed-polls/for-you", response_model=List[schemas.FeedPoll])
def get_feed_polls_for_you(
    *, 
    db: Session = Depends(get_db),
):
    """
    Get all feed polls for a user.
    """
    polls = crud.feed_poll.get_multi(db)
    return polls
