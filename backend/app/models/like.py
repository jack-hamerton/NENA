import uuid
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import datetime

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"))
    owner = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")
