
"""partition_tables

Revision ID: V1
Revises: 
Create Date: 2023-10-27 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'V1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add created_at column to notifications
    op.add_column('notifications', sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()))

    # Partition posts table
    op.execute("""
        ALTER TABLE posts RENAME TO posts_old;
        CREATE TABLE posts (
            id uuid NOT NULL,
            user_id uuid NOT NULL,
            content VARCHAR(280) NOT NULL,
            media_url VARCHAR,
            parent_post_id uuid,
            audience_control VARCHAR,
            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
        ) PARTITION BY RANGE (created_at);
        INSERT INTO posts SELECT * FROM posts_old;
        ALTER TABLE posts ADD CONSTRAINT posts_pkey PRIMARY KEY (id, created_at);
        CREATE INDEX ix_posts_user_id ON posts (user_id);
        DROP TABLE posts_old;
    """)

    # Partition likes table
    op.execute("""
        ALTER TABLE likes RENAME TO likes_old;
        CREATE TABLE likes (
            id SERIAL NOT NULL,
            user_id uuid NOT NULL,
            post_id uuid NOT NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
        ) PARTITION BY RANGE (created_at);
        INSERT INTO likes SELECT * FROM likes_old;
        ALTER TABLE likes ADD CONSTRAINT likes_pkey PRIMARY KEY (id, created_at);
        CREATE INDEX ix_likes_user_id ON likes (user_id);
        CREATE INDEX ix_likes_post_id ON likes (post_id);
        DROP TABLE likes_old;
    """)

    # Partition comments table
    op.execute("""
        ALTER TABLE comments RENAME TO comments_old;
        CREATE TABLE comments (
            id SERIAL NOT NULL,
            text VARCHAR,
            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            episode_id INTEGER,
            user_id uuid,
            parent_comment_id INTEGER
        ) PARTITION BY RANGE (created_at);
        INSERT INTO comments SELECT * FROM comments_old;
        ALTER TABLE comments ADD CONSTRAINT comments_pkey PRIMARY KEY (id, created_at);
        CREATE INDEX ix_comments_user_id ON comments (user_id);
        CREATE INDEX ix_comments_episode_id ON comments (episode_id);
        DROP TABLE comments_old;
    """)

    # Partition notifications table
    op.execute("""
        ALTER TABLE notifications RENAME TO notifications_old;
        CREATE TABLE notifications (
            id SERIAL NOT NULL,
            user_id uuid NOT NULL,
            type VARCHAR,
            payload VARCHAR,
            read BOOLEAN,
            created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
        ) PARTITION BY RANGE (created_at);
        INSERT INTO notifications SELECT * FROM notifications_old;
        ALTER TABLE notifications ADD CONSTRAINT notifications_pkey PRIMARY KEY (id, created_at);
        CREATE INDEX ix_notifications_user_id ON notifications (user_id);
        DROP TABLE notifications_old;
    """)

    # Partition messages table
    op.execute("""
        ALTER TABLE messages RENAME TO messages_old;
        CREATE TABLE messages (
            id SERIAL NOT NULL,
            sender_id uuid,
            recipient_id uuid,
            content TEXT NOT NULL,
            sent_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            message_type VARCHAR,
            media_url VARCHAR,
            is_disappearing BOOLEAN,
            disappearing_duration INTEGER,
            is_view_once BOOLEAN,
            is_encrypted BOOLEAN,
            parent_message_id INTEGER
        ) PARTITION BY RANGE (sent_at);
        INSERT INTO messages SELECT * FROM messages_old;
        ALTER TABLE messages ADD CONSTRAINT messages_pkey PRIMARY KEY (id, sent_at);
        CREATE INDEX ix_messages_sender_id ON messages (sender_id);
        CREATE INDEX ix_messages_recipient_id ON messages (recipient_id);
        DROP TABLE messages_old;
    """)


def downgrade():
    # This is a one-way migration. Downgrading is not supported.
    pass
