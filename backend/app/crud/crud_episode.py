
from sqlalchemy.orm import Session
from app import models

def get_episodes_for_podcast(db: Session, podcast_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Episode)
        .filter(models.Episode.podcast_id == podcast_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
