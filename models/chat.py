
import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship
from .base import Base

# Association table for the many-to-many relationship between users and rooms
room_membership_table = Table(
    "room_memberships",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("room_id", Integer, ForeignKey("rooms.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))
    messages = relationship("Message", back_populates="user")
    rooms = relationship(
        "Room", secondary=room_membership_table, back_populates="members"
    )

    def __repr__(self):
        return f"<User {self.username}>"

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    messages = relationship("Message", back_populates="room")
    members = relationship(
        "User", secondary=room_membership_table, back_populates="rooms"
    )

    def __repr__(self):
        return f"<Room {self.name}>"

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    content = Column(String(1024), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    user = relationship("User", back_populates="messages")
    room = relationship("Room", back_populates="messages")

    def __repr__(self):
        return f"<Message {self.id}>"
