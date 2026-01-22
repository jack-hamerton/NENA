
import datetime
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Collaboration(Base):
    __tablename__ = "collaborations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    title = Column(String, nullable=False)
    description = Column(Text)
    work_type = Column(String)
    status = Column(String, default='open') # open, closed, in-progress
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User", back_populates="collaborations")
    challenges = relationship("Challenge", back_populates="collaboration")
