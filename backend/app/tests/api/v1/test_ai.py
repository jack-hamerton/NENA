
from fastapi.testclient import TestClient
from app.core.config import settings

def test_generate_response(client: TestClient) -> None:
    data = {"prompt": "Hello, AI!"}
    response = client.post(
        f"{settings.API_V1_STR}/ai/generate_response",
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert "response" in content
    assert "dummy conversational response" in content["response"]
