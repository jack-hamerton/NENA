
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base
from app.models.user import User
from app.models.room import Room
from app.models.room_message import RoomMessage
from app.models.trending_audio import TrendingAudio
from app.models.challenge import Challenge
from app.models.collaboration import Collaboration

@pytest.fixture(scope="module")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_create_room_and_message(db_session):
    # 1. Create a test user
    user = User(username="testuser", first_name="test", last_name="user", hashed_password="password")
    db_session.add(user)
    db_session.commit()

    # 2. Create a room
    room = Room(name="Test Room", creator_id=user.id)
    db_session.add(room)
    db_session.commit()

    # 3. Create a message in the room
    message_content = "Hello, room!"
    message = RoomMessage(room_id=room.id, sender_id=user.id, content=message_content)
    db_session.add(message)
    db_session.commit()

    # 4. Retrieve the room and its messages
    retrieved_room = db_session.query(Room).filter_by(id=room.id).one()

    # 5. Assert that the message is in the room's messages
    assert len(retrieved_room.messages) == 1
    assert retrieved_room.messages[0].content == message_content
    assert retrieved_room.messages[0].sender.username == user.username
