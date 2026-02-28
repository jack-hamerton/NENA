"""add users table indexes

Revision ID: 0003_users_indexes
Revises: 0002_common_indexes_and_ai_storage
Create Date: 2026-02-28 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003_users_indexes'
down_revision = '0002_common_indexes_and_ai_storage'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    dialect_name = conn.dialect.name

    # Helper to create index if not exists using SQL
    def create_index_sql(table, col):
        stmt = f"CREATE INDEX IF NOT EXISTS ix_{table}_{col} ON {table} ({col})"
        op.execute(stmt)

    # users: is_active (for filtering), created_at (for sorting)
    # username and email already have unique indexes by model definition
    try:
        create_index_sql('users', 'is_active')
    except Exception:
        pass
    try:
        create_index_sql('users', 'created_at')
    except Exception:
        pass


def downgrade() -> None:
    conn = op.get_bind()
    dialect_name = conn.dialect.name

    # Drop indexes if they exist
    def drop_index_sql(table, col):
        stmt = f"DROP INDEX IF EXISTS ix_{table}_{col}"
        op.execute(stmt)

    try:
        drop_index_sql('users', 'is_active')
    except Exception:
        pass
    try:
        drop_index_sql('users', 'created_at')
    except Exception:
        pass
