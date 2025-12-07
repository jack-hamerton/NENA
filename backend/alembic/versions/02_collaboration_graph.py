"""collaboration graph

Revision ID: 02_collaboration_graph
Revises: 01_init_core
Create Date: 2024-05-14 10:01:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '02_collaboration_graph'
down_revision = '01_init_core'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('collaborations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('field', sa.String(), nullable=False),
    sa.Column('challenges', sa.String(), nullable=False),
    sa.Column('mitigations', sa.String(), nullable=False),
    sa.Column('impact', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_collaborations_id'), 'collaborations', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_collaborations_id'), table_name='collaborations')
    op.drop_table('collaborations')
