
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.db.base_class import Base
import enum

class RoomParticipantRole(str, enum.Enum):
    admin = "admin"
    member = "member"
    speaker = "speaker"
    guest = "guest"

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    created_at = Column(DateTime)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="owned_rooms")
    participants = relationship("RoomParticipant", back_populates="room")

class RoomParticipant(Base):
    __tablename__ = 'room_participants'
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    room_id = Column(Integer, ForeignKey('rooms.id'), primary_key=True)
    role = Column(Enum(RoomParticipantRole), default=RoomParticipantRole.member)
    user = relationship("User", back_populates="rooms")
    room = relationship("Room", back_populates="participants")
