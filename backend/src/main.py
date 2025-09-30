# backend/src/main.py
from fastapi import FastAPI
from users import routes as user_routes

app = FastAPI()

# Register routers
app.include_router(user_routes.router)
