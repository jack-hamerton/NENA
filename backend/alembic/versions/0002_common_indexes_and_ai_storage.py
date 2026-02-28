"""add common indexes and ai_storage table

Revision ID: 0002_common_indexes_and_ai_storage
Revises: 0001_add_posts_content_index
Create Date: 2026-02-28 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_common_indexes_and_ai_storage'
down_revision = '0001_add_posts_content_index'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    dialect_name = conn.dialect.name

    # Create ai_storage table if it doesn't exist
    if dialect_name == 'sqlite':
        op.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_storage (
                id TEXT PRIMARY KEY,
                owner_id TEXT,
                data TEXT,
                url TEXT,
                created_at DATETIME
            )
            """
        )
    else:
        # PostgreSQL
        op.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_storage (
                id UUID PRIMARY KEY,
                owner_id UUID,
                data JSONB,
                url TEXT,
                created_at TIMESTAMPTZ DEFAULT now()
            )
            """
        )

    # Helper to create index if not exists using SQL (works in PG and SQLite)
    def create_index_sql(table, col):
        stmt = f"CREATE INDEX IF NOT EXISTS ix_{table}_{col} ON {table} ({col})"
        op.execute(stmt)

    # posts: author_id, created_at, image_url
    try:
        create_index_sql('posts', 'author_id')
    except Exception:
        pass
    try:
        create_index_sql('posts', 'created_at')
    except Exception:
        pass
    try:
        create_index_sql('posts', 'image_url')
    except Exception:
        pass

    # messages: sender_id
    try:
        create_index_sql('messages', 'sender_id')
    except Exception:
        pass

    # podcasts: creator_id, cover_art_url
    try:
        create_index_sql('podcasts', 'creator_id')
    except Exception:
        pass
    try:
        create_index_sql('podcasts', 'cover_art_url')
    except Exception:
        pass

    # episodes: podcast_id, audio_url, video_url
    try:
        create_index_sql('episodes', 'podcast_id')
    except Exception:
        pass
    try:
        create_index_sql('episodes', 'audio_url')
    except Exception:
        pass
    try:
        create_index_sql('episodes', 'video_url')
    except Exception:
        pass

    # rooms: creator_id
    try:
        create_index_sql('rooms', 'creator_id')
    except Exception:
        pass

    # studies: author_id, created_at
    try:
        create_index_sql('studies', 'author_id')
    except Exception:
        pass
    try:
        create_index_sql('studies', 'created_at')
    except Exception:
        pass

    # comments: user_id, created_at
    try:
        create_index_sql('comments', 'user_id')
    except Exception:
        pass
    try:
        create_index_sql('comments', 'created_at')
    except Exception:
        pass

    # answers: author_id
    try:
        create_index_sql('answers', 'author_id')
    except Exception:
        pass

    # analysis_results: study_id
    try:
        create_index_sql('analysis_results', 'study_id')
    except Exception:
        pass


def downgrade() -> None:
    conn = op.get_bind()
    dialect_name = conn.dialect.name

    # Drop indexes if they exist
    def drop_index_sql(table, col):
        # For sqlite the DROP INDEX IF EXISTS works
        stmt = f"DROP INDEX IF EXISTS ix_{table}_{col}"
        op.execute(stmt)

    # posts
    for col in ('author_id', 'created_at', 'image_url'):
        try:
            drop_index_sql('posts', col)
        except Exception:
            pass

    # messages
    try:
        drop_index_sql('messages', 'sender_id')
    except Exception:
        pass

    # podcasts
    for col in ('creator_id', 'cover_art_url'):
        try:
            drop_index_sql('podcasts', col)
        except Exception:
            pass

    # episodes
    for col in ('podcast_id', 'audio_url', 'video_url'):
        try:
            drop_index_sql('episodes', col)
        except Exception:
            pass

    # rooms
    try:
        drop_index_sql('rooms', 'creator_id')
    except Exception:
        pass

    # studies
    for col in ('author_id', 'created_at'):
        try:
            drop_index_sql('studies', col)
        except Exception:
            pass

    # comments
    for col in ('user_id', 'created_at'):
        try:
            drop_index_sql('comments', col)
        except Exception:
            pass

    # answers
    try:
        drop_index_sql('answers', 'author_id')
    except Exception:
        pass

    # analysis_results
    try:
        drop_index_sql('analysis_results', 'study_id')
    except Exception:
        pass

    # Drop ai_storage table
    if dialect_name == 'sqlite':
        op.execute("DROP TABLE IF EXISTS ai_storage")
    else:
        op.execute("DROP TABLE IF EXISTS ai_storage")
