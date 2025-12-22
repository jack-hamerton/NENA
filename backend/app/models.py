from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    podcasts = relationship("Podcast", back_populates="creator")

class Podcast(Base):
    __tablename__ = "podcasts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="podcasts")

conversation_participants = Table(
    "conversation_participants",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("conversation_id", Integer, ForeignKey("conversations.id")),
)

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True)
    messages = relationship("Message", back_populates="conversation")
    participants = relationship(
        "User",
        secondary=conversation_participants,
        backref="conversations"
    )

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")

room_participants = Table(
    "room_participants",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("room_id", Integer, ForeignKey("rooms.id")),
)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="created_rooms")
    participants = relationship(
        "User",
        secondary=room_participants,
        backref="rooms"
    )
    polls = relationship("Poll", back_populates="room")

User.created_rooms = relationship("Room", back_populates="creator")

votes = Table(
    "votes",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("poll_option_id", Integer, ForeignKey("poll_options.id")),
)

class Poll(Base):
    __tablename__ = "polls"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    room = relationship("Room", back_populates="polls")
    options = relationship("PollOption", back_populates="poll")

class PollOption(Base):
    __tablename__ = "poll_options"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"))
    poll = relationship("Poll", back_populates="options")
    votes = relationship(
        "User",
        secondary=votes,
        backref="votes"
    )
