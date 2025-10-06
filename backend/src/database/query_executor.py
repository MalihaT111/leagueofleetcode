# backend/src/database/query_executor.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# -----------------------------
# Database engine & session
# -----------------------------
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# -----------------------------
# General query executor
# -----------------------------
def execute_query(query: str, fetch: bool = True):
    """
    Execute a raw SQL query against the RDS database.

    Parameters:
        query (str): SQL query string to execute
        fetch (bool): If True, fetch and return results; 
                      if False, commit changes without returning results

    Returns:
        List of dicts (if fetch=True) or None
    """
    results = []
    db = SessionLocal()
    try:
        statement = text(query)
        res = db.execute(statement)
        if fetch:
            # Convert results to list of dicts
            columns = res.keys()
            results = [dict(zip(columns, row)) for row in res.fetchall()]
        else:
            db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
    return results
