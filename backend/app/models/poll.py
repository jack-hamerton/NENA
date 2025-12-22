import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Boolean, Interval
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    duration = Column(Interval, nullable=False)
    anonymous = Column(Boolean, default=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)

    options = relationship("PollOption", back_populates="poll")
    room = relationship("Room", back_populates="polls")

class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    text = Column(String, nullable=False)
    votes = Column(Integer, default=0)

    poll = relationship("Poll", back_populates="options")

class PollVote(Base):
    __tablename__ = "poll_votes"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("poll_options.id"), nullable=False)
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
