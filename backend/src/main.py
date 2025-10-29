from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.database.database import init_db
from src.users import routes as user_routes
from src.matchmaking.routes import router as matchmaking_router

from src.auth.auth import auth_router, register_router, current_user
from src.auth.models import User
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    await init_db()  # async function, needs await
    yield
    # Shutdown code (optional)

app = FastAPI(lifespan=lifespan)
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["Matchmaking"])
app.include_router(user_routes.router)

@app.get("/debug/routes")
def get_routes():
    return [route.path for route in app.routes]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, prefix="/api", tags=["user"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(register_router, prefix="/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "League of LeetCode API", "status": "running"}

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
