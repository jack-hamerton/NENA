import os

os.system("source backend/venv/bin/activate && alembic -c backend/alembic.ini revision --autogenerate -m 'Add Response and Answer models'")
