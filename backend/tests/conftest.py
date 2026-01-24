"""
Pytest configuration and shared fixtures for test suite
"""
import os
import pytest
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import all models BEFORE creating tables to ensure they're registered with Base
from app.models.study import Study, Question, Answer
from app.models.user import User
from app.models.room import Room
from app.models.message import Message
from app.models.post import Post
from app.models.podcast import Podcast, Episode, Shortcut
from app.models.calendar import Event, EventParticipant
from app.models.profile import Profile
from app.models.follower import Follower
from app.models.badge import Badge, UserBadge
from app.models.notification import Notification
from app.models.like import Like
from app.models.comment import Comment
from app.models.quote_post import QuotePost
from app.models.reshare import Reshare
from app.models.room_message import RoomMessage
from app.models.community_room import CommunityRoom, CommunityRoomMessage
from app.models.document import Document
from app.models.challenge import Challenge
from app.models.collaboration import Collaboration
from app.models.analytics import Analytics
from app.models.trending_audio import TrendingAudio
from app.models.hashtag import Hashtag
from app.models.feed_poll import FeedPoll, FeedPollOption, FeedPollVote

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base_class import Base


# Create test database with relative path (will be created in backend directory)
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=False
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    Create all tables in the test database at the start of the test session.
    """
    print("\n==== Creating test database tables ====")
    Base.metadata.create_all(bind=engine)
    print("==== Test database tables created ====\n")
    yield
    print("\n==== Dropping test database tables ====")
    Base.metadata.drop_all(bind=engine)
    print("==== Test database tables dropped ====\n")


@pytest.fixture
def test_client():
    """
    Create a test client with proper database setup.
    """
    from app.main import app
    from app.api import deps
    
    # Override the get_db dependency to use test database
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[deps.get_db] = override_get_db
    
    from fastapi.testclient import TestClient
    client = TestClient(app)
    
    yield client
    
    app.dependency_overrides.clear()
