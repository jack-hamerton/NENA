"""studies core

Revision ID: 06_studies_core
Revises: 05_rooms_core
Create Date: 2024-05-14 10:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06_studies_core'
down_revision = '05_rooms_core'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('studies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('access_code', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['creator_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_studies_id'), 'studies', ['id'], unique=False)

    op.create_table('study_questions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('study_id', sa.Integer(), nullable=False),
    sa.Column('question_text', sa.Text(), nullable=False),
    sa.Column('question_type', sa.String(), nullable=False), # qualitative or quantitative
    sa.Column('method', sa.String(), nullable=True), # survey, KII
    sa.ForeignKeyConstraint(['study_id'], ['studies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('study_responses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('study_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('participant_id', sa.Integer(), nullable=False),
    sa.Column('response', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['study_questions.id'], ),
    sa.ForeignKeyConstraint(['study_id'], ['studies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('study_responses')
    op.drop_table('study_questions')
    op.drop_index(op.f('ix_studies_id'), table_name='studies')
    op.drop_table('studies')
