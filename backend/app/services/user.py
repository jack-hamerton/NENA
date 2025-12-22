
from sqlalchemy.orm import Session, joinedload
from app.models.user import User
from app.models.follower import Follower
from app.schemas.user import UserCreate, User as UserSchema
from app.core.security import get_password_hash
from app.services.profile import ProfileService
from app.schemas.profile import ProfileCreate


class UserService:

    def get_user(self, db: Session, user_id: str) -> UserSchema:
        """
        Gets a user by their ID.

        Args:
            db: The database session.
            user_id: The ID of the user.

        Returns:
            The user, or None if not found.
        """
        user = db.query(User).options(joinedload(User.profile)).filter(User.id == user_id).first()
        if not user:
            return None

        return UserSchema(
            id=user.id,
            name=f"{user.first_name} {user.last_name}",
            username=user.username,
            email=user.email,
            profile_picture_url=user.profile.profile_picture_url if user.profile else None,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            first_name=user.first_name,
            last_name=user.last_name
        )

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
            first_name=user_in.first_name,
            last_name=user_in.last_name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create a profile for the new user
        profile_service = ProfileService()
        profile_in = ProfileCreate(user_id=user.id)
        profile_service.create_profile(db=db, profile_in=profile_in)

        return user

    def follow_user(self, db: Session, follower_id: str, followed_id: str, intent: str = None) -> Follower:
        """
        Creates a new follow relationship.

        Args:
            db: The database session.
            follower_id: The ID of the user who is following.
            followed_id: The ID of the user who is being followed.
            intent: The intent of the follow (e.g., 'supporter', 'amplifier', 'learner').

        Returns:
            The created follower relationship.
        """
        follow = Follower(follower_id=follower_id, followed_id=followed_id, intent=intent)
        db.add(follow)
        db.commit()
        db.refresh(follow)
        return follow

    def unfollow_user(self, db: Session, follower_id: str, followed_id: str):
        """
        Deletes a follow relationship.

        Args:
            db: The database session.
            follower_id: The ID of the user who is unfollowing.
            followed_id: The ID of the user who is being unfollowed.
        """
        follow = db.query(Follower).filter_by(follower_id=follower_id, followed_id=followed_id).first()
        if follow:
            db.delete(follow)
            db.commit()
