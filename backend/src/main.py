from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.matchmaking.routes import router as matchmaking_router

from src.database.database import init_db
from src.users import routes as user_routes
from src.auth.auth import auth_router, register_router, current_user
from src.database.models import User
from src.profile.routes import router as profile_router
from src.auth.models import User

from src.history.routes import router as matchhistory_router


# --- Lifespan event (startup/shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    await init_db()  # async function, needs await
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["Matchmaking"])

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_routes.router, prefix="/api", tags=["user"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(register_router, prefix="/auth", tags=["auth"])
app.include_router(leetcode_router, prefix="/api", tags=["leetcode"])
app.include_router(matchhistory_router, prefix="/api", tags=["history"])
app.include_router(profile_router)
# --- Root Health Check ---
@app.get("/")
async def root():
    return {"message": "LeetCode Tracker API running"}
    @app.get("/")


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
