
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    episode_id = Column(Integer, ForeignKey("episodes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    parent_comment_id = Column(Integer, ForeignKey("comments.id"))

    user = relationship("User")
    episode = relationship("Episode", back_populates="comments")
    replies = relationship("Comment", cascade="all, delete-orphan", back_populates="parent_comment")
    parent_comment = relationship("Comment", remote_side=[id], back_populates="replies")
