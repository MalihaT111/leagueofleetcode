# backend/src/database/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Make sure your DATABASE_URL uses 'mysql+aiomysql://' 
# Example: mysql+aiomysql://user:password@localhost:3306/your_db
DATABASE_URL = os.getenv("DATABASE_URL")

# Async database setup
async_engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(async_engine, expire_on_commit=False)

Base = declarative_base()

# Async dependency for all routes
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

# Function to create tables (async)
async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Backward compatibility exports
engine = async_engine  # For existing imports
