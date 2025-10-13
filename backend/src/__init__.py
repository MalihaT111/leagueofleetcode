# backend/src/init_db.py
from src.database.database import engine, Base
from src.database import models

print("Connecting...")
Base.metadata.create_all(bind=engine)
