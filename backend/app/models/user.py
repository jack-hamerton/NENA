
import uuid
from sqlalchemy import Boolean, Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import datetime

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Privacy settings
    profile_photo_privacy = Column(String, default="everyone")  # everyone, followers, none
    about_privacy = Column(String, default="everyone")  # everyone, followers, none
    online_status_privacy = Column(String, default="everyone")  # everyone, followers, none

    # Two-step verification
    pin_enabled = Column(Boolean(), default=False)
    hashed_pin = Column(String, nullable=True)

    # Call settings
    silence_unknown_callers = Column(Boolean(), default=False)
    call_setting = Column(String, default="anyone") # anyone, friends, none

    posts = relationship("Post", back_populates="owner")
    followers = relationship("Follower", foreign_keys=['Follower.followed_id'], back_populates="followed")
    following = relationship("Follower", foreign_keys=['Follower.follower_id'], back_populates="follower")
    poll_votes = relationship("PollVote", back_populates="user")
    podcasts = relationship("Podcast", back_populates="creator")
    likes = relationship("Like", back_populates="owner")
    events = relationship("Event", back_populates="owner")
    event_participations = relationship("EventParticipant", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    profile = relationship("Profile", uselist=False, back_populates="user")
    rooms = relationship("Room", back_populates="owner")
    feed_polls = relationship("FeedPoll", back_populates="user")
