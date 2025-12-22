
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Podcast])
def read_podcasts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[schemas.Podcast]:
    """
    Retrieve a list of podcasts.
    """
    podcasts = crud.get_podcasts(db, skip=skip, limit=limit)
    return podcasts

@router.post("/", response_model=schemas.Podcast)
def create_podcast(
    *, 
    db: Session = Depends(deps.get_db), 
    podcast_in: schemas.PodcastCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> schemas.Podcast:
    """
    Create a new podcast.
    """
    podcast = crud.create_podcast(db=db, podcast=podcast_in, creator_id=current_user.id)
    return podcast
