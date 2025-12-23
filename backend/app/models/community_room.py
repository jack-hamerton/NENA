
import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class CommunityRoom(Base):
    __tablename__ = "community_rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    messages = relationship("RoomMessage", back_populates="room")

class RoomMessage(Base):
    __tablename__ = "room_messages"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey('community_rooms.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("CommunityRoom", back_populates="messages")
    user = relationship("User", back_populates="messages")
