
from sqlalchemy.orm import Session

from app.models import podcast as podcast_model
from app.schemas import podcast as podcast_schema

def get_podcast(db: Session, podcast_id: int):
    return db.query(podcast_model.Podcast).filter(podcast_model.Podcast.id == podcast_id).first()

def get_podcasts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(podcast_model.Podcast).offset(skip).limit(limit).all()

def create_podcast(db: Session, podcast: podcast_schema.PodcastCreate):
    db_podcast = podcast_model.Podcast(**podcast.dict())
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

def update_podcast(db: Session, podcast_id: int, podcast: podcast_schema.PodcastUpdate):
    db_podcast = db.query(podcast_model.Podcast).filter(podcast_model.Podcast.id == podcast_id).first()
    if db_podcast:
        for key, value in podcast.dict(exclude_unset=True).items():
            setattr(db_podcast, key, value)
        db.commit()
        db.refresh(db_podcast)
    return db_podcast

def delete_podcast(db: Session, podcast_id: int):
    db_podcast = db.query(podcast_model.Podcast).filter(podcast_model.Podcast.id == podcast_id).first()
    if db_podcast:
        db.delete(db_podcast)
        db.commit()
    return db_podcast
