from sqlalchemy import Column, Table, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

post_mentions = Table(
    "post_mentions",
    Base.metadata,
    Column("post_id", UUID(as_uuid=True), ForeignKey("posts.id"), primary_key=True),
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
)
