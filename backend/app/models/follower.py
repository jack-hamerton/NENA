import uuid
from sqlalchemy import Column, ForeignKey, DateTime, func, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base


class Follower(Base):
    __tablename__ = "followers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    follower_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    followed_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    intent = Column(String, nullable=True) # Can be 'supporter', 'amplifier', 'learner', or 'mentor'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    follower = relationship("User", foreign_keys=[follower_id], back_populates="following")
    followed = relationship("User", foreign_keys=[followed_id], back_populates="followers")
