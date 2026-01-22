
import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.types import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.models.room_message import RoomMessage

class Room(Base):
    __tablename__ = 'rooms'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    creator_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    creator = relationship('User', back_populates='rooms')
    participants = relationship('RoomParticipant', back_populates='room', cascade='all, delete-orphan')
    messages = relationship('RoomMessage', back_populates='room', cascade='all, delete-orphan')

class RoomParticipant(Base):
    __tablename__ = 'room_participants'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey('rooms.id'))
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    room = relationship('Room', back_populates='participants')
    user = relationship('User')
