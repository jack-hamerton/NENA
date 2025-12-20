import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime
from .hashtag import post_hashtags

class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content = Column(String(280), nullable=False)  # Twitter-like character limit
    media_url = Column(String)  # For photos, videos, GIFs
    parent_post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=True) # For replies
    audience_control = Column(Enum('everyone', 'followers', 'verified', 'mentioned', name='audience_enum'), default='everyone')
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="posts")
    hashtags = relationship("Hashtag", secondary=post_hashtags, back_populates="posts")
    mentions = relationship("User", secondary="post_mentions")
    thread_parent = relationship("Post", remote_side=[id], back_populates="thread_children")
    thread_children = relationship("Post", back_populates="thread_parent")

