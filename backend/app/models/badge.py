
import uuid
from sqlalchemy import Column, ForeignKey, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Badge(Base):
    __tablename__ = "badges"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    description = Column(String)
    icon_url = Column(String)

    user_badges = relationship("UserBadge", back_populates="badge")

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
   # user_id = Column(String, ForeignKey("users.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    badge_id = Column(String, ForeignKey("badges.id"))
    awarded_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="user_badges")
