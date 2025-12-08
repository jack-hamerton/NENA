
from sqlalchemy.orm import Session
from backend.app.db.models import Podcast, User
from backend.app.schemas.podcast import PodcastCreate


def create_podcast(db: Session, podcast_in: PodcastCreate, creator: User) -> Podcast:
    db_podcast = Podcast(**podcast_in.dict(), creator_id=creator.id)
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

def get_podcast(db: Session, podcast_id: int) -> Podcast:
    return db.query(Podcast).filter(Podcast.id == podcast_id).first()
