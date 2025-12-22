import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Boolean, Interval
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class FeedPoll(Base):
    __tablename__ = "feed_polls"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    duration = Column(Interval, nullable=False)
    anonymous = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    options = relationship("FeedPollOption", back_populates="poll")
    user = relationship("User", back_populates="feed_polls")

class FeedPollOption(Base):
    __tablename__ = "feed_poll_options"

    id = Column(Integer, primary_key=True, index=True)
    feed_poll_id = Column(Integer, ForeignKey("feed_polls.id"), nullable=False)
    text = Column(String, nullable=False)
    votes = Column(Integer, default=0)

    poll = relationship("FeedPoll", back_populates="options")

class FeedPollVote(Base):
    __tablename__ = "feed_poll_votes"

    id = Column(Integer, primary_key=True, index=True)
    feed_poll_id = Column(Integer, ForeignKey("feed_polls.id"), nullable=False)
    option_id = Column(Integer, ForeignKey("feed_poll_options.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
