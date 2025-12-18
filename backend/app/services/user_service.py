
from sqlalchemy.orm import Session
from backend.app.db.models import User, Podcast

def get_user_podcasts(db: Session, user_id: int) -> list[Podcast]:
    return db.query(Podcast).filter(Podcast.creator_id == user_id).all()
