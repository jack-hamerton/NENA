
from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    episode_id = Column(Integer, ForeignKey("episodes.id"))

    options = relationship("PollOption", back_populates="poll", cascade="all, delete-orphan")
    episode = relationship("Episode", back_populates="polls")
    votes = relationship("PollVote", back_populates="poll")

class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    text = Column(String, nullable=False)

    poll = relationship("Poll", back_populates="options")
    votes = relationship("PollVote", back_populates="option")

class PollVote(Base):
    __tablename__ = "poll_votes"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("poll_options.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    poll = relationship("Poll", back_populates="votes")
    option = relationship("PollOption", back_populates="votes")
    user = relationship("User")
