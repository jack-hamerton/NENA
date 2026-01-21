
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    parent_comment_id = Column(Integer, ForeignKey("comments.id"))

    user = relationship("User")
    post = relationship("Post", back_populates="comments")
    replies = relationship("Comment", cascade="all, delete-orphan", back_populates="parent_comment")
    parent_comment = relationship("Comment", remote_side=[id], back_populates="replies")
