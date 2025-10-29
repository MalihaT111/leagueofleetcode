"""
FastAPI-users authentication module.
Import everything you need from here.
"""

from .auth import auth_router, register_router, current_user, fastapi_users
from .models import User
from .schemas import UserCreate, UserRead, UserUpdate

__all__ = [
    "auth_router",
    "register_router", 
    "current_user",
    "fastapi_users",
    "User",
    "UserCreate",
    "UserRead", 
    "UserUpdate"
]