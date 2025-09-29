from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.routes import router as auth_router
from src.users.routes import router as users_router
from src.leetcode.routes import router as leetcode_router
from src.database.database import init_db

app = FastAPI(title="LeetCode Tracker API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    await init_db()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(leetcode_router, prefix="/api/leetcode", tags=["leetcode"])

@app.get("/")
async def root():
    return {"message": "LeetCode Tracker API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}