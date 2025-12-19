
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dependencies import get_db
from app.crud import crud_podcast
from app.schemas import podcast as podcast_schema

router = APIRouter()

@router.post("/", response_model=podcast_schema.Podcast)
def create_podcast(podcast: podcast_schema.PodcastCreate, db: Session = Depends(get_db)):
    return crud_podcast.create_podcast(db=db, podcast=podcast)

@router.get("/", response_model=List[podcast_schema.Podcast])
def read_podcasts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    podcasts = crud_podcast.get_podcasts(db, skip=skip, limit=limit)
    return podcasts

@router.get("/{podcast_id}", response_model=podcast_schema.Podcast)
def read_podcast(podcast_id: int, db: Session = Depends(get_db)):
    db_podcast = crud_podcast.get_podcast(db, podcast_id=podcast_id)
    if db_podcast is None:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return db_podcast

@router.put("/{podcast_id}", response_model=podcast_schema.Podcast)
def update_podcast(podcast_id: int, podcast: podcast_schema.PodcastUpdate, db: Session = Depends(get_db)):
    db_podcast = crud_podcast.update_podcast(db, podcast_id=podcast_id, podcast=podcast)
    if db_podcast is None:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return db_podcast

@router.delete("/{podcast_id}", response_model=podcast_schema.Podcast)
def delete_podcast(podcast_id: int, db: Session = Depends(get_db)):
    db_podcast = crud_podcast.delete_podcast(db, podcast_id=podcast_id)
    if db_podcast is None:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return db_podcast
