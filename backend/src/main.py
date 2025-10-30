from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.database.database import init_db
from src.matchmaking.routes import router as matchmaking_router
from src.history.routes import router as matchhistory_router
from src.users import routes as user_routes
from src.auth.auth import auth_router, register_router, current_user
from src.database.models import User
from src.profile.routes import router as profile_router
# from src.leetcode.routes import router as leetcode_router  # Uncomment if you actually have it

# --- Lifespan event (startup/shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()  # Run database initialization
    yield

# --- FastAPI app instance ---
app = FastAPI(lifespan=lifespan)

# --- CORS middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["Matchmaking"])
app.include_router(user_routes.router, prefix="/api", tags=["user"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(register_router, prefix="/auth", tags=["auth"])
app.include_router(matchhistory_router, prefix="/api", tags=["history"])
app.include_router(profile_router)
# app.include_router(leetcode_router, prefix="/api", tags=["leetcode"])  # Uncomment only if exists

# --- Root Health Check ---
@app.get("/")
async def root():
    return {"message": "LeetCode Tracker API running"}

# --- Authenticated Profile Endpoint ---
@app.get("/me")
async def get_profile(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "leetcode_username": user.leetcode_username,
        "user_elo": user.user_elo,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "is_superuser": user.is_superuser,
    }
