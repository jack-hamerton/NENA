
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.base_class import Base
from ..schemas.post import Audience
from app.models.comment import Comment
import uuid

# Association table for the many-to-many relationship between posts and hashtags
post_hashtag_association = Table(
    'post_hashtag', Base.metadata,
    Column('post_id', UUID(as_uuid=True), ForeignKey('posts.id')),
    Column('hashtag_id', Integer, ForeignKey('hashtags.id'))
)

class Hashtag(Base):
    __tablename__ = 'hashtags'
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, unique=True, index=True)

class Post(Base):
    __tablename__ = 'posts'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(String, index=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())
    audience = Column(SQLAlchemyEnum(Audience), default=Audience.PUBLIC, nullable=False)

    author = relationship("User", back_populates="posts")
    likes = relationship("Like", back_populates="post")
    comments = relationship("Comment")
    hashtags = relationship("Hashtag", secondary=post_hashtag_association)
