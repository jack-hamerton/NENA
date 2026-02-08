import os

# Default to a single worker to avoid concurrent startup race when
# SQLAlchemy creates enum types on app boot.
workers = int(os.getenv("GUNICORN_WORKERS", "1"))
bind = "0.0.0.0:8000"
worker_class = "uvicorn.workers.UvicornWorker"
