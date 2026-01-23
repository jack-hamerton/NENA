
import pytest
from starlette.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import get_db
from app.models.user import User


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

def test_create_and_get_study(client, db_session):
    # 1. Test creating a new study
    study_data = {
        "title": "Test Study",
        "description": "This is a test study.",
        "methodology": "Test methodology",
        "questions": [
            {"text": "What is your favorite color?", "question_type": "qualitative"},
            {"text": "How many hours do you sleep?", "question_type": "quantitative"}
        ]
    }
    response = client.post("/api/v1/studies/", json=study_data)
    assert response.status_code == 200
    created_study = response.json()
    assert created_study["title"] == study_data["title"]
    assert len(created_study["questions"]) == 2

    # 2. Test getting the created study by its ID
    study_id = created_study["id"]
    response = client.get(f"/api/v1/studies/{study_id}")
    assert response.status_code == 200
    retrieved_study = response.json()
    assert retrieved_study["title"] == study_data["title"]

def test_submit_and_verify_answers(client, db_session):
    # 1. Create a user first
    user = User(first_name="Test", last_name="User", username="testuser", email="testuser@example.com", hashed_password="password")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # 2. Create a study first
    study_data = {
        "title": "Participation Test Study",
        "description": "A study to test participation.",
        "methodology": "Testing methodology",
        "questions": [
            {"text": "Your feedback?", "question_type": "qualitative"}
        ]
    }
    response = client.post("/api/v1/studies/", json=study_data)
    created_study = response.json()
    study_id = created_study["id"]
    question_id = created_study["questions"][0]["id"]

    # 3. Submit an answer to the study
    answer_data = {
        "text": "It was great!",
        "author_id": str(user.id)
    }
    response = client.post(f"/api/v1/studies/{study_id}/questions/{question_id}/answers/", json=answer_data)
    assert response.status_code == 200

    # 4. Verify that the user is marked as a participant
    response = client.get(f"/api/v1/studies/{study_id}/has_participated/{user.id}")
    assert response.status_code == 200
    assert response.json() == True

    # 5. Verify that the answer was saved correctly
    response = client.get(f"/api/v1/studies/{study_id}/answers/")
    assert response.status_code == 200
    answers = response.json()
    assert len(answers) == 1
    assert answers[0]["text"] == answer_data["text"]
    assert answers[0]["author_id"] == str(user.id)

def test_submit_answers_and_trigger_ai_analysis(client, db_session):
    # 1. Create a user and a study
    user = User(first_name="Test", last_name="User", username="testuser", email="testuser@example.com", hashed_password="password")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    study_data = {
        "title": "AI Analysis Test Study",
        "description": "A study to test AI analysis.",
        "methodology": "Testing methodology",
        "questions": [
            {"text": "What are your thoughts on AI?", "question_type": "qualitative"}
        ]
    }
    response = client.post("/api/v1/studies/", json=study_data)
    created_study = response.json()
    study_id = created_study["id"]
    question_id = created_study["questions"][0]["id"]

    # 2. Submit answers
    answer_submission = {
        "user_id": str(user.id),
        "answers": {
            str(question_id): "AI is the future!"
        }
    }

    # 3. Verify the websocket broadcast
    with client.websocket_connect(f"/ws/study/{study_id}") as websocket:
        response = client.post(f"/api/v1/studies/{study_id}/answers", json=answer_submission)
        assert response.status_code == 202
        data = websocket.receive_json()
        assert "sentiment" in data
        assert "themes" in data
        assert "key_quotes" in data
