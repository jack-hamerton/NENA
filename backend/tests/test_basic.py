#!/usr/bin/env python3
"""
Basic tests for the NENA backend
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200

def test_api_docs():
    """Test that API docs are accessible"""
    response = client.get("/api/v1/docs")
    assert response.status_code == 200

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert b"healthy" in response.content

if __name__ == "__main__":
    pytest.main([__file__, "-v"])