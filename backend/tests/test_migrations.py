
import os
import pytest
from sqlalchemy import create_engine, inspect
from alembic.config import Config
from alembic import command

TEST_DB_FILE = "./test_migrations.db"

@pytest.fixture(scope="function")
def test_db():
    # Use a file-based SQLite database for testing
    db_url = f"sqlite:///{TEST_DB_FILE}"
    engine = create_engine(db_url)
    
    yield db_url, engine
    
    engine.dispose()
    if os.path.exists(TEST_DB_FILE):
        os.remove(TEST_DB_FILE)

def test_run_migrations(test_db):
    db_url, engine = test_db
    
    # Set up Alembic configuration
    alembic_ini_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../alembic.ini"))
    migrations_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../migrations"))
    
    alembic_cfg = Config(alembic_ini_path)
    alembic_cfg.set_main_option("script_location", migrations_path)
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)

    # Run migrations to the 'head' (latest) version
    command.upgrade(alembic_cfg, "head")

    # Verify that the expected tables have been created
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    assert "users" in tables
    assert "rooms" in tables
    assert "messages" in tables
    assert "posts" in tables
    assert "room_memberships" in tables
