import uuid
from sqlalchemy import Column, String, Table, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base


post_hashtags = Table(
    "post_hashtags",
    Base.metadata,
    Column("post_id", UUID(as_uuid=True), ForeignKey("posts.id"), primary_key=True),
    Column("hashtag_id", UUID(as_uuid=True), ForeignKey("hashtags.id"), primary_key=True),
)

class Hashtag(Base):
    __tablename__ = "hashtags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(String, unique=True, index=True, nullable=False)

    posts = relationship("Post", secondary=post_hashtags, back_populates="hashtags")
