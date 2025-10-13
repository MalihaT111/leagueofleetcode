from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.database.database import init_db
from src.users import routes as user_routes
from src.auth import auth_router, register_router, current_user, User
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    init_db()  # sync function, no await
    yield
    # Shutdown code (optional)

app = FastAPI(lifespan=lifespan)


# Include routers
app.include_router(user_routes.router)
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(register_router, prefix="/auth", tags=["auth"])

@app.get("/me")
async def get_profile(user: User = Depends(current_user)):
    return {"email": user.email}