# backend/src/init_db.py
from src.database.database import engine, Base

print("Connecting...")
Base.metadata.create_all(bind=engine)
