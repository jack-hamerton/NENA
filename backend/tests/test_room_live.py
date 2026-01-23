
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.config import settings
from app.db.base_class import Base
from app.db.session import get_db

# Setup the test database
SQLALCHEMY_DATABASE_URL = f"{settings.DATABASE_URL}_test"
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
def temp_room():
    """Fixture to create a temporary room for tests."""
    response = client.post(
        f"{settings.API_V1_STR}/rooms/",
        json={"name": "Live Test Room"},
    )
    assert response.status_code == 200
    room = response.json()
    yield room
    # You might want to add cleanup logic here if necessary

def test_room_chat_websocket(temp_room):
    """Tests the entire chat flow within a room via WebSockets."""
    room_id = temp_room["id"]
    test_message = "Hello, WebSocket!"

    with client.websocket_connect(f"/api/v1/ws/rooms/{room_id}/chat") as websocket:
        # Send a message
        websocket.send_json({"message": test_message})
        
        # Receive the message back
        data = websocket.receive_json()
        
        # Assert the message content is correct
        assert "message" in data
        assert data["message"] == test_message
        
        # Assert that the sender info is present (assuming the backend adds it)
        assert "sender" in data

