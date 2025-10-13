# backend/src/database/models.py
# Import the FastAPI-users compatible User model
from src.auth.models import User

# Re-export User for backward compatibility
__all__ = ["User"]