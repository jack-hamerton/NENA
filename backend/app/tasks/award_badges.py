
from fastapi_utils.tasks import repeat_every
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.badge_service import (
    check_and_award_dialogue_builder_badge,
    check_and_award_story_amplifier_badge,
    check_and_award_podcast_creator_badge,
    check_and_award_community_mentor_badge,
    check_and_award_challenge_contributor_badge,
)
from app.crud.crud_user import user as crud_user


@repeat_every(seconds=60 * 60)  # Run once an hour
def award_badges_task():
    db: Session = SessionLocal()
    try:
        users = crud_user.get_multi(db, skip=0, limit=1000)  # Adjust limit as needed
        for user in users:
            check_and_award_dialogue_builder_badge(db, user)
            check_and_award_story_amplifier_badge(db, user)
            check_and_award_podcast_creator_badge(db, user)
            check_and_award_community_mentor_badge(db, user)
            check_and_award_challenge_contributor_badge(db, user)
    finally:
        db.close()
