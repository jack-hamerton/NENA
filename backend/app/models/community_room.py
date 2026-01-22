
import datetime
import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class CommunityRoom(Base):
    __tablename__ = "community_rooms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    messages = relationship("RoomMessage", back_populates="room")

class RoomMessage(Base):
    __tablename__ = "room_messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey('community_rooms.id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("CommunityRoom", back_populates="messages")
    user = relationship("User", back_populates="room_messages")
