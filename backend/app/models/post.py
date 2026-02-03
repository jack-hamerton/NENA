
import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.base_class import Base
from ..schemas.post import Audience
from app.models.comment import Comment
from app.models.hashtag import post_hashtags


post_mentions = Table(
    "post_mentions",
    Base.metadata,
    Column("post_id", UUID(as_uuid=True), ForeignKey("posts.id"), primary_key=True),
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
)

class Post(Base):
    __tablename__ = 'posts'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(String, index=True)
    image_url = Column(String, nullable=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())
    audience = Column(SQLAlchemyEnum(Audience), default=Audience.PUBLIC, nullable=False)

    author = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post")
    comments = relationship("Comment", back_populates="post")
    hashtags = relationship("Hashtag", secondary=post_hashtags, back_populates="posts")
    mentions = relationship("User", secondary=post_mentions, back_populates="mentioned_in")
