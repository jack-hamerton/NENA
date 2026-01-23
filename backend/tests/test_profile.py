
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models.user import User
from app.models.profile import Profile
from app.models.collaboration import Collaboration
from app.models.challenge import Challenge
from app.models.trending_audio import TrendingAudio
from app.schemas.profile import ProfileCreate, ProfileUpdate
from app.services.profile import ProfileService
from app.db.base_class import Base
import uuid

# Fixture to create a database session
@pytest.fixture(scope="function")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
    Base.metadata.drop_all(engine)

# Fixture to create a profile service
@pytest.fixture(scope="module")
def profile_service():
    return ProfileService()

def test_create_and_get_profile(db_session: Session, profile_service: ProfileService):
    """
    Test creating and retrieving a profile.
    """
    # Create a user manually
    user = User(id=uuid.uuid4(), email="test@example.com", username="testuser", hashed_password="password", first_name="Test", last_name="User")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create a profile
    profile_in = ProfileCreate(user_id=user.id, bio="This is a test bio.")
    created_profile = profile_service.create_profile(db=db_session, profile_in=profile_in)

    # Get the profile
    retrieved_profile = profile_service.get_profile_by_user_id(db=db_session, user_id=user.id)

    assert retrieved_profile is not None
    assert retrieved_profile.user_id == user.id
    assert retrieved_profile.bio == "This is a test bio."

def test_update_profile(db_session: Session, profile_service: ProfileService):
    """
    Test updating a profile.
    """
    # Create a user manually
    user = User(id=uuid.uuid4(), email="test2@example.com", username="testuser2", hashed_password="password", first_name="Test", last_name="User2")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create a profile
    profile_in = ProfileCreate(user_id=user.id, bio="This is another test bio.")
    created_profile = profile_service.create_profile(db=db_session, profile_in=profile_in)

    # Update the profile
    profile_update = ProfileUpdate(bio="This is the updated bio.")
    updated_profile = profile_service.update_profile(db=db_session, user_id=user.id, profile_in=profile_update)

    # Get the updated profile
    retrieved_profile = profile_service.get_profile_by_user_id(db=db_session, user_id=user.id)

    assert updated_profile.bio == "This is the updated bio."

