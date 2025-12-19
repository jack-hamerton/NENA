from sqlalchemy.orm import Session
from app.models.profile import Profile
from app.schemas.profile import ProfileCreate, ProfileUpdate
from typing import Optional
import uuid


class ProfileService:

    def create_profile(self, db: Session, profile_in: ProfileCreate) -> Profile:
        """
        Creates a new profile for a user.

        Args:
            db: The database session.
            profile_in: The profile data.

        Returns:
            The created profile.
        """
        profile = Profile(**profile_in.dict())
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    def get_profile_by_user_id(self, db: Session, user_id: uuid.UUID) -> Optional[Profile]:
        """
        Gets a user's profile.

        Args:
            db: The database session.
            user_id: The ID of the user.

        Returns:
            The user's profile, or None if not found.
        """
        return db.query(Profile).filter(Profile.user_id == user_id).first()

    def update_profile(self, db: Session, user_id: uuid.UUID, profile_in: ProfileUpdate) -> Optional[Profile]:
        """
        Updates a user's profile.

        Args:
            db: The database session.
            user_id: The ID of the user.
            profile_in: The updated profile data.

        Returns:
            The updated profile, or None if not found.
        """
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        if profile:
            for var, value in vars(profile_in).items():
                setattr(profile, var, value) if value else None
            db.commit()
            db.refresh(profile)
        return profile
