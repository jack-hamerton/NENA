
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base
from app.models.user import User
from app.models.notification import Notification
from app.models.analytics import Analytics
from app.models.badge import Badge
from app.models.calendar import Event, EventParticipant
from app.models.challenge import Challenge
from app.models.collaboration import Collaboration
from app.models.comment import Comment
from app.models.community_room import CommunityRoom
from app.models.document import Document
from app.models.feed_poll import FeedPoll
from app.models.follower import Follower
from app.models.hashtag import Hashtag
from app.models.like import Like
from app.models.message import Message
from app.models.podcast import Podcast
from app.models.poll import Poll, PollVote
from app.models.post import Post
from app.models.post_mention import PostMention
from app.models.profile import Profile
from app.models.quote_post import QuotePost
from app.models.reshare import Reshare
from app.models.room import Room
from app.models.study import Study
from app.models.trending_audio import TrendingAudio
from app.services.notification_service import NotificationService

@pytest.fixture(scope="module")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_create_and_get_notification(db_session):
    # 1. Create a test user
    user = User(username="testuser", first_name="test", last_name="user", hashed_password="password")
    db_session.add(user)
    db_session.commit()

    # 2. Create a notification for the user
    notification_content = "This is a test notification."
    NotificationService.create_notification(db=db_session, user_id=user.id, content=notification_content)

    # 3. Retrieve notifications for the user
    notifications = NotificationService.get_notifications_for_user(db=db_session, user_id=user.id)

    # 4. Assert that the notification was created and retrieved
    assert len(notifications) == 1
    assert notifications[0].content == notification_content
    assert notifications[0].user_id == user.id
