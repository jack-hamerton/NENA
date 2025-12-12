from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class EventParticipant(Base):
    __tablename__ = "event_participants"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("event.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    status = Column(String, default="pending")

    event = relationship("Event", back_populates="participants")
    user = relationship("User", back_populates="event_participations")

    __table_args__ = (UniqueConstraint('event_id', 'user_id', name='_event_user_uc'),)
