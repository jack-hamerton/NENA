from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Challenge])
def read_challenges(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve challenges.
    """
    challenges = crud.challenge.get_multi(db, skip=skip, limit=limit)
    return challenges


@router.post("/", response_model=schemas.Challenge)
def create_challenge(
    *, 
    db: Session = Depends(deps.get_db),
    challenge_in: schemas.ChallengeCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new challenge.
    """
    challenge = crud.challenge.create(db, obj_in=challenge_in)
    return challenge
