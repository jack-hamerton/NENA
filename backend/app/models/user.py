from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    posts = relationship("Post", back_populates="owner")
    followers = relationship("Follower", foreign_keys=["Follower.followed_id"], back_populates="followed")
    following = relationship("Follower", foreign_keys=["Follower.follower_id"], back_populates="follower")

    events = relationship("Event", back_populates="owner")
    event_participations = relationship("EventParticipant", back_populates="user")
    poll_votes = relationship("PollVote", back_populates="user")
    podcasts = relationship("Podcast", back_populates="creator")
