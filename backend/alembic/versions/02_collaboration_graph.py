"""collaboration graph

Revision ID: 02_collaboration_graph
Revises: 01_init_core
Create Date: 2023-12-14 10:01:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '02_collaboration_graph'
down_revision = '01_init_core'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'followers',
        sa.Column('follower_id', sa.Integer, sa.ForeignKey('users.id'), primary_key=True),
        sa.Column('followed_id', sa.Integer, sa.ForeignKey('users.id'), primary_key=True),
    )

    op.create_table(
        'collaboration_books',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('field', sa.String(100), nullable=False),
        sa.Column('challenges', sa.Text, nullable=False),
        sa.Column('mitigations', sa.Text, nullable=False),
        sa.Column('impact', sa.Integer, nullable=False),
    )


def downgrade():
    op.drop_table('collaboration_books')
    op.drop_table('followers')
