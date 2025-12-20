import uuid
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Poll(Base):
    __tablename__ = "polls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)
    options = relationship("PollOption", back_populates="poll")

class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    poll_id = Column(UUID(as_uuid=True), ForeignKey("polls.id"), nullable=False)
    text = Column(String, nullable=False)
    votes = Column(Integer, default=0)

    poll = relationship("Poll", back_populates="options")
