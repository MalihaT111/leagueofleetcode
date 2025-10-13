"""
Complete FastAPI-users authentication setup.
Everything you need for auth in one file.
"""

import os
from fastapi import Depends
from fastapi_users import FastAPIUsers, BaseUserManager, IntegerIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from src.auth.models import User
from src.auth.schemas import UserCreate, UserRead
from src.database.database import get_db

load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


# User Manager
class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET_KEY
    verification_token_secret = SECRET_KEY


# Database adapter
def get_user_db(session: Session = Depends(get_db)):
    yield SQLAlchemyUserDatabase(session, User)


# User manager dependency
async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


# JWT Strategy
def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=SECRET_KEY, 
        lifetime_seconds=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


# Authentication backend
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=BearerTransport(tokenUrl="auth/login"),
    get_strategy=get_jwt_strategy,
)

# FastAPI Users instance
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

# Auth routes (ready to include in your main app)
auth_router = fastapi_users.get_auth_router(auth_backend)  # /login, /logout
register_router = fastapi_users.get_register_router(UserRead, UserCreate)  # /register

# Current user dependency for protecting routes
current_user = fastapi_users.current_user()