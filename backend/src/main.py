from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.database.database import init_db
from src.users import routes as user_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    init_db()  # sync function, no await
    yield
    # Shutdown code (optional)

app = FastAPI(lifespan=lifespan)

# Include routers
app.include_router(user_routes.router)
