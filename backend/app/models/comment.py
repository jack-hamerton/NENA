
import datetime
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey("comments.id"))
    episode_id = Column(UUID(as_uuid=True), ForeignKey("episodes.id"))

    user = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    episode = relationship("Episode", back_populates="comments")
    replies = relationship("Comment", cascade="all, delete-orphan", back_populates="parent_comment")
    parent_comment = relationship("Comment", remote_side=[id], back_populates="replies")
