"""add index to posts.content

Revision ID: 0001_add_posts_content_index
Revises: 
Create Date: 2026-02-28 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_add_posts_content_index'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # create an index on the posts.content column to speed up content searches
    # use a raw SQL statement with IF NOT EXISTS for idempotence across DBs
    conn = op.get_bind()
    dialect_name = conn.dialect.name
    if dialect_name == 'sqlite':
        op.execute("CREATE INDEX IF NOT EXISTS ix_posts_content ON posts(content)")
    else:
        op.create_index('ix_posts_content', 'posts', ['content'], unique=False)


def downgrade() -> None:
    conn = op.get_bind()
    dialect_name = conn.dialect.name
    if dialect_name == 'sqlite':
        op.execute("DROP INDEX IF EXISTS ix_posts_content")
    else:
        op.drop_index('ix_posts_content', table_name='posts')
