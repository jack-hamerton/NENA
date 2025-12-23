
import asyncio
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.crud.crud_badge import badge
from app.schemas.badge import BadgeCreate

def seed_badges(db: Session):
    badges = [
        BadgeCreate(
            name="Dialogue Builder",
            description="Awarded for consistent, respectful participation in community rooms.",
            icon_url="/icons/dialogue-builder.svg"
        ),
        BadgeCreate(
            name="Story Amplifier",
            description="Awarded for amplifying others’ narratives.",
            icon_url="/icons/story-amplifier.svg"
        ),
        BadgeCreate(
            name="Podcast Creator",
            description="Awarded for publishing impactful podcasts.",
            icon_url="/icons/podcast-creator.svg"
        ),
        BadgeCreate(
            name="Community Mentor",
            description="Awarded for guiding and supporting peers.",
            icon_url="/icons/community-mentor.svg"
        ),
        BadgeCreate(
            name="Challenge Contributor",
            description="Awarded for completing advocacy challenges.",
            icon_url="/icons/challenge-contributor.svg"
        ),
    ]

    for badge_in in badges:
        existing_badge = badge.get_by_name(db, name=badge_in.name)
        if not existing_badge:
            badge.create(db, obj_in=badge_in)

async def main():
    db = SessionLocal()
    try:
        seed_badges(db)
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(main())
