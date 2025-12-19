from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from app.services.profile import ProfileService
from app.schemas.profile import ProfileCreate


class UserService:

    def create_user(self, db: Session, user_in: UserCreate) -> User:
        """
        Creates a new user and an associated profile.

        Args:
            db: The database session.
            user_in: The user data.

        Returns:
            The created user.
        """
        hashed_password = get_password_hash(user_in.password)
        user = User(
            username=user_in.username,
            email=user_in.email,
            hashed_password=hashed_password,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create a profile for the new user
        profile_service = ProfileService()
        profile_in = ProfileCreate(user_id=user.id)
        profile_service.create_profile(db=db, profile_in=profile_in)

        return user
