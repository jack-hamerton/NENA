"""init core

Revision ID: 01_init_core
Revises: 
Create Date: 2023-12-14 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '01_init_core'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(50), unique=True, nullable=False),
        sa.Column('email', sa.String(120), unique=True, nullable=False),
        sa.Column('hashed_password', sa.String(128), nullable=False),
        sa.Column('profile_picture', sa.String(255), nullable=True),
        sa.Column('is_verified', sa.Boolean, default=False),
        sa.Column('phone_number', sa.String(20), unique=True, nullable=True),
    )

    op.create_table(
        'posts',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('content', sa.String(280), nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )


def downgrade():
    op.drop_table('posts')
    op.drop_table('users')
