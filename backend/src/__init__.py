# backend/src/init_db.py
import asyncio
from src.database.database import init_db
from src.database import models

async def main():
    print("Creating tables...")
    await init_db()
    print("Tables created successfully!")

if __name__ == "__main__":
    asyncio.run(main())
