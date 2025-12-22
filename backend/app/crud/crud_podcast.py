
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from app import models, schemas


def get_podcast(db: Session, podcast_id: int):
    return db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()


def get_podcasts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Podcast).options(joinedload(models.Podcast.creator)).offset(skip).limit(limit).all()


def create_podcast(db: Session, podcast: schemas.PodcastCreate, creator_id: UUID):
    db_podcast = models.Podcast(**podcast.dict(), creator_id=creator_id)
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

def get_podcasts_by_owner(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Podcast)
        .filter(models.Podcast.creator_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_podcast(db: Session, podcast_id: int, podcast: schemas.PodcastUpdate):
    db_podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()
    if db_podcast:
        for key, value in podcast.dict(exclude_unset=True).items():
            setattr(db_podcast, key, value)
        db.commit()
        db.refresh(db_podcast)
    return db_podcast


def delete_podcast(db: Session, podcast_id: int):
    db_podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()
    if db_podcast:
        db.delete(db_podcast)
        db.commit()
    return db_podcast
