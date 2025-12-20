from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.TrendingAudio])
def read_trending_audios(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve trending audios.
    """
    trending_audios = crud.trending_audio.get_multi(db, skip=skip, limit=limit)
    return trending_audios


@router.post("/", response_model=schemas.TrendingAudio)
def create_trending_audio(
    *, 
    db: Session = Depends(deps.get_db),
    trending_audio_in: schemas.TrendingAudioCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new trending audio.
    """
    trending_audio = crud.trending_audio.create(db, obj_in=trending_audio_in)
    return trending_audio
