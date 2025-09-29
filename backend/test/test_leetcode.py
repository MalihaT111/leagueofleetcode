import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_get_problems():
    """Test getting LeetCode problems"""
    # TODO: Implement test
    pass

def test_get_user_submissions():
    """Test getting user submissions"""
    # TODO: Implement test
    pass

def test_sync_user_progress():
    """Test syncing user progress"""
    # TODO: Implement test
    pass