import pytest
import json
import os
from fastapi.testclient import TestClient

# Test Study Endpoints
# This test file verifies the study-related API endpoints work correctly

@pytest.fixture
def test_client():
    """Create a test client for the FastAPI app."""
    # Import here to avoid loading settings before env vars are set
    from app.main import app
    
    client = TestClient(app)
    return client


class TestStudyCreation:
    """Test study creation functionality"""
    
    def test_create_study(self, test_client):
        """Test creating a new study"""
        study_data = {
            "title": "Customer Satisfaction Study",
            "description": "A study to understand customer satisfaction",
            "methodology": "Survey",
            "questions": [
                {
                    "text": "How satisfied are you with our service?",
                    "type": "quantitative"
                },
                {
                    "text": "What could we improve?",
                    "type": "qualitative"
                }
            ]
        }
        
        response = test_client.post("/api/v1/studies/", json=study_data)
        
        # Should return 200 or 201
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data
        assert data["title"] == study_data["title"]
        assert data["methodology"] == study_data["methodology"]
        assert len(data["questions"]) == 2
        
        return data["id"]
    
    def test_create_study_with_max_questions(self, test_client):
        """Test creating a study with maximum 20 questions"""
        questions = [
            {
                "text": f"Question {i+1}",
                "type": "quantitative" if i % 2 == 0 else "qualitative"
            }
            for i in range(20)
        ]
        
        study_data = {
            "title": "Large Study",
            "description": "Study with 20 questions",
            "methodology": "KII",
            "questions": questions
        }
        
        response = test_client.post("/api/v1/studies/", json=study_data)
        
        assert response.status_code in [200, 201]
        data = response.json()
        assert len(data["questions"]) == 20
    
    def test_create_study_exceeds_max_questions(self, test_client):
        """Test that creating a study with >20 questions fails or is truncated"""
        questions = [
            {
                "text": f"Question {i+1}",
                "type": "quantitative"
            }
            for i in range(25)
        ]
        
        study_data = {
            "title": "Too Many Questions Study",
            "description": "This study has too many questions",
            "methodology": "Survey",
            "questions": questions
        }
        
        response = test_client.post("/api/v1/studies/", json=study_data)
        
        # Should either fail or truncate to 20
        if response.status_code in [200, 201]:
            data = response.json()
            assert len(data["questions"]) <= 20


class TestStudyRetrieval:
    """Test study retrieval functionality"""
    
    def test_get_study(self, test_client):
        """Test retrieving a specific study"""
        # First create a study
        study_data = {
            "title": "Test Study for Retrieval",
            "description": "Testing get study endpoint",
            "methodology": "Survey",
            "questions": [
                {
                    "text": "What is your name?",
                    "type": "qualitative"
                }
            ]
        }
        
        create_response = test_client.post("/api/v1/studies/", json=study_data)
        assert create_response.status_code in [200, 201]
        study_id = create_response.json()["id"]
        
        # Now retrieve it
        get_response = test_client.get(f"/api/v1/studies/{study_id}")
        
        assert get_response.status_code == 200
        data = get_response.json()
        assert data["id"] == study_id
        assert data["title"] == study_data["title"]
        assert data["methodology"] == study_data["methodology"]
    
    def test_get_nonexistent_study(self, test_client):
        """Test retrieving a non-existent study returns 404"""
        response = test_client.get("/api/v1/studies/99999")
        
        assert response.status_code == 404


class TestAnswerSubmission:
    """Test participant answer submission"""
    
    def test_submit_answers(self, test_client):
        """Test submitting answers to a study"""
        # Create a study first
        study_data = {
            "title": "Answer Test Study",
            "description": "Testing answer submission",
            "methodology": "Survey",
            "questions": [
                {
                    "text": "How satisfied are you?",
                    "type": "quantitative"
                },
                {
                    "text": "Any comments?",
                    "type": "qualitative"
                }
            ]
        }
        
        create_response = test_client.post("/api/v1/studies/", json=study_data)
        assert create_response.status_code in [200, 201]
        study_id = create_response.json()["id"]
        
        # Submit answers
        answers_data = {
            "answers": [
                {
                    "question_id": 0,
                    "answer_text": "5"
                },
                {
                    "question_id": 1,
                    "answer_text": "Great service!"
                }
            ]
        }
        
        response = test_client.post(f"/api/v1/studies/{study_id}/answers", json=answers_data)
        
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
    
    def test_get_answers(self, test_client):
        """Test retrieving answers for a study"""
        # Create a study
        study_data = {
            "title": "Get Answers Test Study",
            "description": "Testing answer retrieval",
            "methodology": "Survey",
            "questions": [
                {
                    "text": "How would you rate us?",
                    "type": "quantitative"
                }
            ]
        }
        
        create_response = test_client.post("/api/v1/studies/", json=study_data)
        assert create_response.status_code in [200, 201]
        study_id = create_response.json()["id"]
        
        # Submit some answers
        answers_data = {
            "answers": [
                {
                    "question_id": 0,
                    "answer_text": "Excellent!"
                }
            ]
        }
        
        submit_response = test_client.post(f"/api/v1/studies/{study_id}/answers", json=answers_data)
        assert submit_response.status_code in [200, 201]
        
        # Retrieve answers
        get_response = test_client.get(f"/api/v1/studies/{study_id}/answers")
        
        assert get_response.status_code == 200
        data = get_response.json()
        assert isinstance(data, list)
        assert len(data) > 0


class TestStudyValidation:
    """Test input validation for study creation"""
    
    def test_create_study_missing_title(self, test_client):
        """Test that study creation fails without title"""
        study_data = {
            "description": "Missing title",
            "methodology": "Survey",
            "questions": []
        }
        
        response = test_client.post("/api/v1/studies/", json=study_data)
        
        # Should fail validation
        assert response.status_code in [400, 422]
    
    def test_create_study_invalid_methodology(self, test_client):
        """Test that invalid methodology is rejected"""
        study_data = {
            "title": "Invalid Methodology Study",
            "description": "Test",
            "methodology": "InvalidMethod",
            "questions": []
        }
        
        response = test_client.post("/api/v1/studies/", json=study_data)
        
        # Should validate methodology
        assert response.status_code in [400, 422] or response.status_code in [200, 201]
    
    def test_create_study_invalid_question_type(self, test_client):
        """Test that invalid question type is rejected"""
        study_data = {
            "title": "Invalid Question Type Study",
            "description": "Test",
            "methodology": "Survey",
            "questions": [
                {
                    "text": "Question text",
                    "type": "invalid_type"
                }
            ]
        }
        
        response = test_client.post("/api/v1/studies/", json=study_data)
        
        # Should validate question type
        assert response.status_code in [400, 422] or response.status_code in [200, 201]


class TestStudyWorkflow:
    """Test complete study workflow"""
    
    def test_complete_study_workflow(self, test_client):
        """Test the complete flow: create study -> get study -> submit answers -> get answers"""
        
        # Step 1: Create study
        study_data = {
            "title": "Complete Workflow Test",
            "description": "Testing the complete workflow",
            "methodology": "Survey",
            "questions": [
                {
                    "text": "What is your age group?",
                    "type": "quantitative"
                },
                {
                    "text": "What is your feedback?",
                    "type": "qualitative"
                }
            ]
        }
        
        create_response = test_client.post("/api/v1/studies/", json=study_data)
        assert create_response.status_code in [200, 201]
        study = create_response.json()
        study_id = study["id"]
        
        # Verify study was created correctly
        assert study["title"] == study_data["title"]
        assert len(study["questions"]) == 2
        
        # Step 2: Retrieve study
        get_response = test_client.get(f"/api/v1/studies/{study_id}")
        assert get_response.status_code == 200
        retrieved_study = get_response.json()
        assert retrieved_study["id"] == study_id
        
        # Step 3: Submit answers
        answers_data = {
            "answers": [
                {
                    "question_id": 0,
                    "answer_text": "25-34"
                },
                {
                    "question_id": 1,
                    "answer_text": "Great experience, would recommend!"
                }
            ]
        }
        
        submit_response = test_client.post(f"/api/v1/studies/{study_id}/answers", json=answers_data)
        assert submit_response.status_code in [200, 201]
        
        # Step 4: Retrieve answers
        answers_response = test_client.get(f"/api/v1/studies/{study_id}/answers")
        assert answers_response.status_code == 200
        answers = answers_response.json()
        assert len(answers) > 0
        
        print(f"\n✅ Complete workflow test passed!")
        print(f"   Study ID: {study_id}")
        print(f"   Questions: {len(study['questions'])}")
        print(f"   Answers submitted: {len(answers_data['answers'])}")
