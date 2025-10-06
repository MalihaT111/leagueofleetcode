# backend/src/init_db.py
from database.database import engine, Base
from database import models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
