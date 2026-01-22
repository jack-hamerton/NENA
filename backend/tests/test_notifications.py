
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from app.services.notification_service import NotificationService
from app.models.trending_audio import TrendingAudio
from app.models.challenge import Challenge
from app.models.collaboration import Collaboration
from app.models.room_message import RoomMessage

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
    notification_in = NotificationCreate(user_id=user.id, type="test_notification", payload={"content": notification_content})
    notification_service = NotificationService()
    notification_service.create_notification(db=db_session, notification_in=notification_in)

    # 3. Retrieve notifications for the user
    notifications = notification_service.get_notifications_by_user(db=db_session, user_id=user.id)

    # 4. Assert that the notification was created and retrieved
    assert len(notifications) == 1
    assert notifications[0].payload["content"] == notification_content
    assert notifications[0].user_id == user.id
