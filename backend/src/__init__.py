from database.database import engine, Base
from database import models

print("Creating tables...")
Base.metadata.create_all(bind=engine)