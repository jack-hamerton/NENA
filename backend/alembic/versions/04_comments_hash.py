"""comments hash

Revision ID: 04_comments_hash
Revises: 03_messages_partitions
Create Date: 2024-05-14 10:03:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '04_comments_hash'
down_revision = '03_messages_partitions'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('comments',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('parent_comment_id', sa.BigInteger(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id', 'created_at'),
    postgresql_partition_by='RANGE (created_at)'
    )


def downgrade():
    op.drop_table('comments')
