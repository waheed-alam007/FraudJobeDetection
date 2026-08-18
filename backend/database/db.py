import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base
from config import settings

logger = logging.getLogger(__name__)

# DATABASE_URL is fully dynamic via env var.
# Defaults to a local SQLite file so the project runs out-of-the-box
# without requiring a Postgres server for local development/testing.
# For production, set DATABASE_URL to a Postgres connection string, e.g.:
#   postgresql://user:password@host:5432/dbname
DATABASE_URL = settings.DATABASE_URL

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Create all tables if they don't exist yet."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info(f"✓ Database initialized ({DATABASE_URL.split('://')[0]})")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
