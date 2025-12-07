"""indexes and views

Revision ID: 07_indexes_views
Revises: 06_studies_core
Create Date: 2024-05-14 10:06:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07_indexes_views'
down_revision = '06_studies_core'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
    CREATE MATERIALIZED VIEW user_engagement_analytics AS
    SELECT
        u.id as user_id,
        COUNT(p.id) as post_count,
        COUNT(f.follower_id) as following_count,
        COUNT(f2.followed_id) as followers_count,
        (
            SELECT COUNT(*) 
            FROM posts p2 
            WHERE p2.user_id = u.id
        ) as total_posts
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    LEFT JOIN followers f ON u.id = f.follower_id
    LEFT JOIN followers f2 ON u.id = f2.followed_id
    GROUP BY u.id;
    """)


def downgrade():
    op.execute("DROP MATERIALIZED VIEW user_engagement_analytics")
