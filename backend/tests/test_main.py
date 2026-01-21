
import os
import runpy
import sys
import pytest

def test_run_migrations():
    old_argv = sys.argv
    old_cwd = os.getcwd()
    env_file_path = os.path.join(old_cwd, "backend/.env")

    env_content = '''POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=test_db
DATABASE_URL=postgresql://postgres:postgres@localhost/test_db
SECRET_KEY=secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
S3_ENDPOINT_URL=http://localhost:9000
S3_ACCESS_KEY_ID=minio
S3_SECRET_ACCESS_KEY=minio123
S3_BUCKET_NAME=nena
'''

    try:
        with open(env_file_path, "w") as f:
            f.write(env_content)

        sys.argv = ['alembic', 'upgrade', 'head']

        try:
            # The run_migrations.py script changes the current working directory to 'backend'
            runpy.run_module('run_migrations', run_name='__main__', alter_sys=True)
        except SystemExit as e:
            # A non-zero exit code from alembic indicates an error.
            if e.code != 0:
                pytest.fail(f"Migrations failed with exit code: {e.code}")
        except Exception as e:
            pytest.fail(f"An exception occurred during migrations: {e}")

    finally:
        # Restore cwd and argv
        os.chdir(old_cwd)
        sys.argv = old_argv
        # Clean up the .env file
        if os.path.exists(env_file_path):
            os.remove(env_file_path)
