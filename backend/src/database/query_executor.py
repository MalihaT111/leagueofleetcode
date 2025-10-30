# backend/src/database/query_executor.py
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text
import os
from dotenv import load_dotenv

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# -----------------------------
# Async database engine & session
# -----------------------------
async_engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(async_engine, expire_on_commit=False)

# -----------------------------
# General async query executor
# -----------------------------
async def execute_query(engine, query: str, params: dict = None, fetch: bool = True):

    """
    Execute a raw SQL query against the RDS database asynchronously.

    Parameters:
        query (str): SQL query string to execute
        params (dict): Parameters for the query
        fetch (bool): If True, fetch and return results; 
                      if False, commit changes without returning results

    Returns:
        List of dicts (if fetch=True) or None
    """
    results = []
    async with AsyncSessionLocal() as db:
        try:
            statement = text(query)
            res = await db.execute(statement, params or {})
            if fetch:
                # Convert results to list of dicts
                columns = res.keys()
                results = [dict(zip(columns, row)) for row in res.fetchall()]
            else:
                await db.commit()
        except Exception as e:
            await db.rollback()
            raise e
    async with AsyncSessionLocal() as db:
        try:
            statement = text(query)
            res = await db.execute(statement, params or {})
            if fetch:
                # Convert results to list of dicts
                columns = res.keys()
                results = [dict(zip(columns, row)) for row in res.fetchall()]
            else:
                await db.commit()
        except Exception as e:
            await db.rollback()
            raise e
    return results


# ✅ Wrap test in an async main function
from pprint import pprint
async def main():
    data = await execute_query("SHOW COLUMNS IN users")
    pprint(data)


if __name__ == "__main__":
    asyncio.run(main())