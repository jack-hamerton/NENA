
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import uuid

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Podcast])
def read_podcasts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[schemas.Podcast]:
    """Retrieve all podcasts."""
    podcasts = crud.podcast.get_podcasts(db, skip=skip, limit=limit)
    return podcasts


@router.post("/", response_model=schemas.Podcast)
def create_podcast(
    *, 
    db: Session = Depends(deps.get_db),
    title: str,
    description: str,
    cover_art: UploadFile = File(...),
    podcast_file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> schemas.Podcast:
    """Create a new podcast."""
    # In a real application, you would upload the files to a cloud storage
    # and get the URL. For this example, we'll use placeholders.
    cover_art_url = f"covers/{cover_art.filename}"
    podcast_url = f"podcasts/{podcast_file.filename}"

    podcast_in = schemas.PodcastCreate(title=title, description=description, cover_art_url=cover_art_url, audio_url=podcast_url)
    podcast = crud.podcast.create_podcast(db=db, podcast=podcast_in, creator_id=current_user.id)
    return podcast


@router.get("/by-user/{user_id}", response_model=List[schemas.Podcast])
def read_podcasts_by_user(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[schemas.Podcast]:
    """Retrieve all podcasts for a specific user."""
    podcasts = crud.podcast.get_podcasts_by_owner(db, user_id=user_id, skip=skip, limit=limit)
    return podcasts


@router.get("/{podcast_id}", response_model=schemas.Podcast)
def read_podcast(
    *, db: Session = Depends(deps.get_db), podcast_id: int
) -> schemas.Podcast:
    """Retrieve a specific podcast."""
    podcast = crud.podcast.get_podcast(db, podcast_id=podcast_id)
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return podcast
