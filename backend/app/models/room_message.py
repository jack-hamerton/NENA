import datetime
import uuid
from sqlalchemy import (
    Column, Text, DateTime, ForeignKey, String, Boolean, Integer
)
from sqlalchemy.types import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class RoomMessage(Base):
    __tablename__ = "room_messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey('rooms.id'))
    sender_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("Room", back_populates="messages")
    sender = relationship("User", back_populates="room_messages")
