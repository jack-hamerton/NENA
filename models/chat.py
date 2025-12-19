
import datetime
import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Table,
    Enum,
)
from sqlalchemy.orm import relationship
from .base import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"

class RoomRole(enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"

class RoomMembership(Base):
    __tablename__ = 'room_memberships'
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    room_id = Column(Integer, ForeignKey('rooms.id'), primary_key=True)
    role = Column(Enum(RoomRole), default=RoomRole.MEMBER, nullable=False)
    user = relationship("User", back_populates="room_associations")
    room = relationship("Room", back_populates="member_associations")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(128))
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    messages = relationship("Message", back_populates="user")
    room_associations = relationship("RoomMembership", back_populates="user")
    posts = relationship("Post", back_populates="author")

    def __repr__(self):
        return f"<User {self.username}>"

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    messages = relationship("Message", back_populates="room")
    member_associations = relationship("RoomMembership", back_populates="room")

    @property
    def members(self):
        return [association.user for association in self.member_associations]


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
