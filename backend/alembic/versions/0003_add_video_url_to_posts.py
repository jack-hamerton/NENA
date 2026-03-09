"""Add video_url column to posts table

Revision ID: 0004_add_video_url_to_posts
Revises: 0003_users_indexes
Create Date: 2026-03-08 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0003_add_video_url_to_posts'
down_revision = '0002_users_indexes'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add video_url column to posts table
    op.add_column('posts', sa.Column('video_url', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove video_url column from posts table
    op.drop_column('posts', 'video_url')
