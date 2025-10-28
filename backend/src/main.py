from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.matchmaking.routes import router as matchmaking_router

from src.database.database import init_db
<<<<<<< HEAD
from src.users import routes as user_routes
from src.auth.auth import auth_router, register_router, current_user
from src.database.models import User
=======
from src.users.routes import router as user_router
from src.auth.routes import router as auth_router      # if you have auth
from src.leetcode.routes import router as leetcode_router  # if you have leetcode
from src.history.routes import router as matchhistory_router



# --- Lifespan event (startup/shutdown) ---
>>>>>>> a4498b2 (started match history)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    await init_db()  # async function, needs await
    yield
    # Shutdown code (optional)

app = FastAPI(lifespan=lifespan)
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["Matchmaking"])


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
<<<<<<< HEAD
    allow_origins=["http://localhost:3001", "http://localhost:3000"],  # Allow frontend origins
=======
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # your frontend origin
>>>>>>> a4498b2 (started match history)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Include routers
app.include_router(user_routes.router, prefix="/api", tags=["user"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(register_router, prefix="/auth", tags=["auth"])

=======
# --- Register Routers ---
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(leetcode_router, prefix="/api/leetcode", tags=["leetcode"])
app.include_router(matchhistory_router, prefix="/api/history", tags=["history"])
# --- Root Health Check ---
>>>>>>> a4498b2 (started match history)
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