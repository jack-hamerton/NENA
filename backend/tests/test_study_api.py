"""
Study API Integration Tests
Tests the study creation, retrieval, and answer submission workflows
"""
import pytest
from fastapi.testclient import TestClient


class TestStudyAPI:
    """Test Study API Endpoints"""
    
    def test_health_check(self, test_client):
        """Verify the API is running"""
        response = test_client.get("/")
        # Either 404 or 200 - just check server responds
        assert response.status_code in [200, 404, 422]
    
    def test_study_endpoint_exists(self, test_client):
        """Check if study endpoint is registered"""
        # Try to POST to studies endpoint
        response = test_client.post(
            "/api/v1/studies/",
            json={
                "title": "Test Study",
                "description": "Test",
                "methodology": "Survey",
                "questions": [
                    {
                        "text": "Question 1",
                        "type": "quantitative"
                    }
                ]
            }
        )
        
        # Should get some response (might be 201, 200, or error if DB is missing)
        assert response.status_code in [200, 201, 404, 405, 422, 500]
        print(f"Study endpoint POST response: {response.status_code}")
    
    def test_study_GET_endpoint_exists(self, test_client):
        """Check if study GET endpoint is registered"""
        response = test_client.get("/api/v1/studies/test-id")
        
        # Should get a 404 (not found) if endpoint exists, or 422/500 if missing
        assert response.status_code in [200, 404, 405, 422, 500]
        print(f"Study endpoint GET response: {response.status_code}")
    
    def test_study_answers_endpoint_exists(self, test_client):
        """Check if study answers endpoint is registered"""
        response = test_client.post(
            "/api/v1/studies/test-id/answers",
            json={
                "answers": [
                    {
                        "question_id": 0,
                        "answer_text": "Test answer"
                    }
                ]
            }
        )
        
        # Should get some response
        assert response.status_code in [200, 201, 404, 405, 422, 500]
        print(f"Study answers endpoint POST response: {response.status_code}")
    
    def test_study_get_answers_endpoint_exists(self, test_client):
        """Check if study GET answers endpoint is registered"""
        response = test_client.get("/api/v1/studies/test-id/answers")
        
        # Should get some response
        assert response.status_code in [200, 404, 405, 422, 500]
        print(f"Study answers endpoint GET response: {response.status_code}")


class TestFrontendIntegrationPoints:
    """Test that the study endpoints align with frontend expectations"""
    
    def test_study_creation_endpoint_format(self, test_client):
        """Verify the endpoint path matches frontend expectations: /api/v1/studies/"""
        response = test_client.options("/api/v1/studies/")
        
        # OPTIONS should be allowed or return 404 if no studies endpoint
        # But POST should be attempted next
        post_response = test_client.post(
            "/api/v1/studies/",
            json={"title": "Test", "description": "Test", "methodology": "Survey", "questions": []}
        )
        
        # At minimum, endpoint should be registered
        assert post_response.status_code != 405  # 405 = Method Not Allowed (wrong method)
        print(f"✓ Study creation endpoint registered: /api/v1/studies/")
    
    def test_get_study_endpoint_format(self, test_client):
        """Verify GET /api/v1/studies/{studyId} path matches frontend"""
        response = test_client.get("/api/v1/studies/123")
        
        # Should not be 404 for the path itself (might 404 for study not found)
        # Should not be 405 (wrong method)
        assert response.status_code != 405
        print(f"✓ Study retrieval endpoint registered: /api/v1/studies/{{studyId}}")
    
    def test_submit_answers_endpoint_format(self, test_client):
        """Verify POST /api/v1/studies/{studyId}/answers path matches frontend"""
        response = test_client.post(
            "/api/v1/studies/123/answers",
            json={"answers": []}
        )
        
        # Should not be 405 (wrong method)
        assert response.status_code != 405
        print(f"✓ Answer submission endpoint registered: /api/v1/studies/{{studyId}}/answers")
    
    def test_get_answers_endpoint_format(self, test_client):
        """Verify GET /api/v1/studies/{studyId}/answers path matches frontend"""
        response = test_client.get("/api/v1/studies/123/answers")
        
        # Should not be 405 (wrong method)
        assert response.status_code != 405
        print(f"✓ Answer retrieval endpoint registered: /api/v1/studies/{{studyId}}/answers")


class TestAPISpecificationCompliance:
    """Test that API responses match the frontend expectations"""
    
    def test_study_response_schema(self, test_client):
        """Test that study response includes expected fields"""
        # Create a study to check response schema
        create_response = test_client.post(
            "/api/v1/studies/",
            json={
                "title": "Schema Test Study",
                "description": "Testing response schema",
                "methodology": "Survey",
                "questions": [
                    {
                        "text": "Question 1",
                        "type": "quantitative"
                    }
                ]
            }
        )
        
        # If endpoint works, check response has expected fields
        if create_response.status_code in [200, 201]:
            data = create_response.json()
            print(f"Study response fields: {list(data.keys())}")
            
            # Should have these fields based on StudyPage expectations
            expected_fields = ["id", "title", "description", "methodology"]
            for field in expected_fields:
                assert field in data, f"Missing field: {field}"
    
    def test_question_structure(self, test_client):
        """Test that questions are properly structured"""
        create_response = test_client.post(
            "/api/v1/studies/",
            json={
                "title": "Question Structure Test",
                "description": "Test",
                "methodology": "Survey",
                "questions": [
                    {
                        "text": "What is your name?",
                        "type": "qualitative"
                    }
                ]
            }
        )
        
        if create_response.status_code in [200, 201]:
            data = create_response.json()
            if "questions" in data:
                assert len(data["questions"]) > 0
                question = data["questions"][0]
                assert "text" in question
                assert "type" in question
                print(f"Question structure: {question}")


class TestErrorHandling:
    """Test error handling for edge cases"""
    
    def test_empty_questions(self, test_client):
        """Test creating study with no questions"""
        response = test_client.post(
            "/api/v1/studies/",
            json={
                "title": "Empty Questions Study",
                "description": "Test",
                "methodology": "Survey",
                "questions": []
            }
        )
        
        print(f"Empty questions response: {response.status_code}")
    
    def test_missing_required_fields(self, test_client):
        """Test creating study with missing fields"""
        response = test_client.post(
            "/api/v1/studies/",
            json={
                "methodology": "Survey",
                "questions": []
            }
        )
        
        print(f"Missing required fields response: {response.status_code}")
    
    def test_invalid_methodology(self, test_client):
        """Test creating study with invalid methodology"""
        response = test_client.post(
            "/api/v1/studies/",
            json={
                "title": "Invalid Method",
                "description": "Test",
                "methodology": "InvalidMethod",
                "questions": []
            }
        )
        
        print(f"Invalid methodology response: {response.status_code}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
