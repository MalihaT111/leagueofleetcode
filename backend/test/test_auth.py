import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_register_user():
    """Test user registration"""
    # TODO: Implement test
    pass

def test_login_user():
    """Test user login"""
    # TODO: Implement test
    pass

def test_get_current_user():
    """Test getting current user info"""
    # TODO: Implement test
    pass