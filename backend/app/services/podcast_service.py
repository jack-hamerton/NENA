
from sqlalchemy.orm import Session

from app.models.post import Post
from app.schemas.post import PostCreate
from app.services.post_service import create_post
from app.db.models import User


def create_podcast(db: Session, post_in: PostCreate, current_user: User) -> Post:
    # TODO: Add logic to differentiate between post and podcast
    # For now, just create a normal post
    return create_post(db, post_in, current_user)
