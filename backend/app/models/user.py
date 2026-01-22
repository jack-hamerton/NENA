import datetime
import uuid

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.analytics import Analytics
from app.models.challenge import Challenge
from app.models.document import Document
from app.models.calendar import Event, EventParticipant
from app.models.feed_poll import FeedPoll
from app.models.follower import Follower
from app.models.like import Like
from app.models.message import Message
from app.models.notification import Notification
from app.models.podcast import Podcast, PodcastFollower
from app.models.poll import Poll, PollVote
from app.models.post import Post, post_mentions
from app.models.profile import Profile
from app.models.badge import UserBadge
from app.models.quote_post import QuotePost
from app.models.reshare import Reshare
from app.models.room import Room
from app.models.study import Study


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
    call_setting = Column(String, default="anyone")  # anyone, friends, none

    posts = relationship("Post", back_populates="author")
    followers = relationship("Follower", foreign_keys=[Follower.followed_id], back_populates="followed")
    following = relationship("Follower", foreign_keys=[Follower.follower_id], back_populates="follower")
    poll_votes = relationship("PollVote", back_populates="user")
    podcasts = relationship("Podcast", back_populates="creator")
    podcast_following = relationship("PodcastFollower", back_populates="user")
    likes = relationship("Like", back_populates="owner")
    events = relationship("Event", back_populates="owner")
    event_participations = relationship("EventParticipant", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    profile = relationship("Profile", uselist=False, back_populates="user")
    rooms = relationship("Room", back_populates="creator")
    feed_polls = relationship("FeedPoll", back_populates="user")
    user_badges = relationship("UserBadge", back_populates="user")
    documents = relationship("Document", back_populates="author")
    polls = relationship("Poll", back_populates="author")
    studies = relationship("Study", back_populates="author")
    challenges = relationship("Challenge", back_populates="author")
    analytics = relationship("Analytics", back_populates="user")
    mentioned_in = relationship("Post", secondary=post_mentions, back_populates="mentions")
    sent_messages = relationship("Message", foreign_keys=[Message.sender_id], back_populates="sender")
    received_messages = relationship("Message", foreign_keys=[Message.recipient_id], back_populates="recipient")
    quote_posts = relationship("QuotePost", back_populates="user")
    reshares = relationship("Reshare", back_populates="user")
    room_messages = relationship("RoomMessage", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    collaborations = relationship("Collaboration", back_populates="creator")

