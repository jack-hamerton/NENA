
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
import datetime

from database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))

    author = relationship("User", back_populates="messages")
    room = relationship("Room", back_populates="messages")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    messages = relationship("Message", back_populates="author")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    messages = relationship("Message", back_populates="room")
