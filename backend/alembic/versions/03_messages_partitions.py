"""messages partitions

Revision ID: 03_messages_partitions
Revises: 02_collaboration_graph
Create Date: 2023-12-14 10:02:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '03_messages_partitions'
down_revision = '02_collaboration_graph'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE TABLE messages (id SERIAL, content TEXT, sender_id INTEGER, recipient_id INTEGER, created_at TIMESTAMPTZ NOT NULL, PRIMARY KEY (id, created_at)) PARTITION BY RANGE (created_at);")


def downgrade():
    op.execute("DROP TABLE messages;")
