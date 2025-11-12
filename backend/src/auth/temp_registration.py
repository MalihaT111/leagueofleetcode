"""
Temporary registration storage for pending user verifications.
Stores registration data until LeetCode username is verified.
"""
import secrets
from typing import Optional, Dict
from datetime import datetime, timedelta
from pydantic import BaseModel

class TempRegistration(BaseModel):
    email: str
    hashed_password: str
    leetcode_hash: str
    user_elo: int = 1200
    created_at: datetime
    expires_at: datetime

# In-memory storage (for production, use Redis or database table)
_temp_registrations: Dict[str, TempRegistration] = {}

def create_temp_registration(email: str, hashed_password: str) -> str:
    """
    Create a temporary registration and return the verification hash.
    """
    # Generate unique verification hash
    leetcode_hash = secrets.token_urlsafe(32)
    
    # Create temp registration with 24-hour expiration
    now = datetime.utcnow()
    temp_reg = TempRegistration(
        email=email,
        hashed_password=hashed_password,
        leetcode_hash=leetcode_hash,
        created_at=now,
        expires_at=now + timedelta(hours=24)
    )
    
    # Store by email (overwrite if exists)
    _temp_registrations[email.lower()] = temp_reg
    
    return leetcode_hash

def get_temp_registration(email: str) -> Optional[TempRegistration]:
    """
    Retrieve a temporary registration by email.
    Returns None if not found or expired.
    """
    temp_reg = _temp_registrations.get(email.lower())
    
    if not temp_reg:
        return None
    
    # Check if expired
    if datetime.utcnow() > temp_reg.expires_at:
        # Clean up expired registration
        _temp_registrations.pop(email.lower(), None)
        return None
    
    return temp_reg

def get_temp_registration_by_hash(leetcode_hash: str) -> Optional[tuple[str, TempRegistration]]:
    """
    Find a temporary registration by its verification hash.
    Returns (email, temp_reg) tuple or None if not found.
    """
    for email, temp_reg in _temp_registrations.items():
        if temp_reg.leetcode_hash == leetcode_hash:
            # Check if expired
            if datetime.utcnow() > temp_reg.expires_at:
                _temp_registrations.pop(email, None)
                return None
            return (email, temp_reg)
    return None

def delete_temp_registration(email: str) -> bool:
    """
    Delete a temporary registration.
    Returns True if deleted, False if not found.
    """
    if email.lower() in _temp_registrations:
        del _temp_registrations[email.lower()]
        return True
    return False

def cleanup_expired_registrations():
    """
    Remove all expired temporary registrations.
    Should be called periodically.
    """
    now = datetime.utcnow()
    expired_emails = [
        email for email, temp_reg in _temp_registrations.items()
        if now > temp_reg.expires_at
    ]
    
    for email in expired_emails:
        del _temp_registrations[email]
    
    return len(expired_emails)
