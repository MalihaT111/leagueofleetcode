from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.database.database import init_db
from src.users import routes as user_routes
from src.matchmaking.routes import router as matchmaking_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    init_db()  # sync function, no await
    yield
    # Shutdown code (optional)

app = FastAPI(lifespan=lifespan)
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["Matchmaking"])
app.include_router(user_routes.router)

@app.get("/debug/routes")
def get_routes():
    return [route.path for route in app.routes]