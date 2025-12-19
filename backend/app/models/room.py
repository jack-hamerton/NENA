import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class RoomRole(enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    participants = relationship("RoomParticipant", back_populates="room")
    polls = relationship("Poll", back_populates="room")

class RoomParticipant(Base):
    __tablename__ = "room_participants"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey('rooms.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    role = Column(Enum(RoomRole), default=RoomRole.MEMBER)
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)

    room = relationship("Room", back_populates="participants")
    user = relationship("User")