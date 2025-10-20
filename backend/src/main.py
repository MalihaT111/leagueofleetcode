from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from src.database.database import init_db
from src.users.routes import router as user_router
from src.auth.routes import router as auth_router      # if you have auth
from src.leetcode.routes import router as leetcode_router  # if you have leetcode

# --- Lifespan event (startup/shutdown) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("nitializing database...")
    init_db()  # sync call, creates tables if not exist
    yield
    print("Shutting down backend...")

# --- Create FastAPI app ---
app = FastAPI(title="LeetCode Tracker API", lifespan=lifespan)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register Routers ---
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(leetcode_router, prefix="/api/leetcode", tags=["leetcode"])

# --- Root Health Check ---
@app.get("/")
async def root():
    return {"message": "LeetCode Tracker API running"}
