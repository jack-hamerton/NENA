
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import UserCreate
from app.schemas.profile import ProfileCreate, ProfileUpdate
from app.services.user import UserService
from app.services.profile import ProfileService
from app.db.base import Base

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

# Fixture to create a user service
@pytest.fixture(scope="module")
def user_service():
    return UserService()

# Fixture to create a profile service
@pytest.fixture(scope="module")
def profile_service():
    return ProfileService()

def test_create_and_get_profile(db_session: Session, user_service: UserService, profile_service: ProfileService):
    """
    Test creating and retrieving a profile.
    """
    # Create a user
    user_in = UserCreate(email="test@example.com", password="password", first_name="Test", last_name="User")
    user = user_service.create_user(db=db_session, user_in=user_in)

    # Create a profile
    profile_in = ProfileCreate(user_id=user.id, bio="This is a test bio.")
    created_profile = profile_service.create_profile(db=db_session, profile_in=profile_in)

    # Get the profile
    retrieved_profile = profile_service.get_profile_by_user_id(db=db_session, user_id=user.id)

    assert retrieved_profile is not None
    assert retrieved_profile.user_id == user.id
    assert retrieved_profile.bio == "This is a test bio."

def test_update_profile(db_session: Session, user_service: UserService, profile_service: ProfileService):
    """
    Test updating a profile.
    """
    # Create a user
    user_in = UserCreate(email="test2@example.com", password="password", first_name="Test", last_name="User2")
    user = user_service.create_user(db=db_session, user_in=user_in)

    # Create a profile
    profile_in = ProfileCreate(user_id=user.id, bio="This is another test bio.")
    created_profile = profile_service.create_profile(db=db_session, profile_in=profile_in)

    # Update the profile
    profile_update = ProfileUpdate(bio="This is the updated bio.")
    updated_profile = profile_service.update_profile(db=db_session, user_id=user.id, profile_in=profile_update)

    # Get the updated profile
    retrieved_profile = profile_service.get_profile_by_user_id(db=db_session, user_id=user.id)

    assert updated_profile is not None
    assert retrieved_profile.bio == "This is the updated bio."

