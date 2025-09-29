from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from src.auth.schemas import UserCreate, UserLogin, Token
from src.auth.service import AuthService

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    """Register a new user"""
    return await AuthService.register_user(user)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token"""
    user_login = UserLogin(email=form_data.username, password=form_data.password)
    return await AuthService.authenticate_user(user_login)

@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user info"""
    return await AuthService.get_current_user(token)

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """Logout user"""
    return await AuthService.logout_user(token)