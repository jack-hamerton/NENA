
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Room(Base):
    __tablename__ = 'rooms'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    creator_id = Column(Integer, ForeignKey('user.id'))
    creator = relationship('User')
    participants = relationship('RoomParticipant', back_populates='room', cascade='all, delete-orphan')

class RoomParticipant(Base):
    __tablename__ = 'room_participants'
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey('rooms.id'))
    user_id = Column(Integer, ForeignKey('user.id'))
    room = relationship('Room', back_populates='participants')
    user = relationship('User')
