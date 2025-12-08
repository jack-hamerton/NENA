from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.core.config import settings
from app.tests.utils.room import create_random_room
from app.tests.utils.user import create_random_user

def test_create_poll_in_room(client: TestClient, db: Session) -> None:
    user = create_random_user(db)
    room = create_random_room(db, owner_id=user.id)
    data = {
        "question": "Test Question",
        "options": ["Option 1", "Option 2"],
        "duration_minutes": 10,
    }
    response = client.post(
        f"{settings.API_V1_STR}/rooms/{room.id}/polls",
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["question"] == data["question"]
    assert content["options"] == data["options"]
    assert "id" in content

def test_vote_in_poll_in_room(client: TestClient, db: Session) -> None:
    user = create_random_user(db)
    room = create_random_room(db, owner_id=user.id)
    data = {
        "question": "Test Question for Voting",
        "options": ["Option A", "Option B"],
        "duration_minutes": 5,
    }
    response = client.post(
        f"{settings.API_V1_STR}/rooms/{room.id}/polls",
        json=data,
    )
    assert response.status_code == 200
    poll = response.json()
    vote_data = {"option": "Option A"}
    response = client.post(
        f"{settings.API_V1_STR}/rooms/{room.id}/polls/{poll['id']}/vote",
        json=vote_data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Vote recorded"
