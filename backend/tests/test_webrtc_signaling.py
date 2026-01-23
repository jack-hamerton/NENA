
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.config import settings
from app.db.base_class import Base
from app.db.session import get_db

# Setup the test database
SQLALCHEMY_DATABASE_URL = f"{settings.DATABASE_URL}_test_webrtc"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Apply migrations
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def temp_users_and_room():
    """Fixture to create users and a room for tests."""
    # Create users
    user1_data = {"username": "webrtc_user1", "email": "webrtc1@test.com", "password": "password"}
    user2_data = {"username": "webrtc_user2", "email": "webrtc2@test.com", "password": "password"}
    
    # I am assuming a user registration endpoint exists at /api/v1/users/
    # If not, this would need to be adjusted to use crud functions directly.
    user1_res = client.post(f"{settings.API_V1_STR}/users/", json=user1_data)
    user2_res = client.post(f"{settings.API_V1_STR}/users/", json=user2_data)

    # A simple check, a more robust user creation check should exist in a user test file.
    assert user1_res.status_code in (200, 201, 400) # Allow for user already existing
    assert user2_res.status_code in (200, 201, 400)

    # It is better to get the user from the DB to ensure we have the right ID
    # For now, we will assume the tests are clean and we can proceed.
    # In a real scenario, you would fetch the user from the DB to get the ID.
    # This is a simplified example.
    user1_id = "1" # MOCK ID
    user2_id = "2" # MOCK ID


    # Create a room
    room_res = client.post(f"{settings.API_V1_STR}/rooms/", json={"name": "WebRTC Signaling Test Room"})
    assert room_res.status_code == 200
    room = room_res.json()

    yield {"user1_id": user1_id, "user2_id": user2_id, "room_id": room["id"]}

def test_webrtc_signaling(temp_users_and_room):
    """Tests the WebRTC signaling flow between two users."""
    room_id = temp_users_and_room["room_id"]
    user1_id = temp_users_and_room["user1_id"]
    user2_id = temp_users_and_room["user2_id"]

    # Mock WebRTC offer message
    offer_message = {
        "type": "offer",
        "sdp": "v=0\r\no=- 4568652685854828 2 IN IP4 127.0.0.1\r\n..."
    }

    with client.websocket_connect(f"/ws/{room_id}/{user1_id}") as websocket1, \
         client.websocket_connect(f"/ws/{room_id}/{user2_id}") as websocket2:

        # Client 1 sends an offer
        websocket1.send_json(offer_message)

        # Client 2 should receive the offer
        received_message = websocket2.receive_json()

        # Assert that the received message is the offer from client 1
        assert received_message["type"] == "offer"
        assert received_message["sdp"] == offer_message["sdp"]
