
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Text,
    Enum,
    Table,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime
import enum

Base = declarative_base()

# Association table for Followers
followers = Table(
    "followers",
    Base.metadata,
    Column("follower_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("followed_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    profile_picture_url = Column(String, nullable=True)
    
    is_active = Column(Boolean(), default=True)
    is_verified = Column(Boolean(), default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    # Analytics and Collaboration info
    profile_analytics = Column(JSONB, default={})
    collaboration_info = Column(JSONB, default={})

    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    
    following = relationship(
        "User",
        secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref="followers",
    )
    
    rooms = relationship("RoomParticipant", back_populates="user")
    created_studies = relationship("Study", back_populates="creator")
    created_events = relationship("CalendarEvent", back_populates="creator")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(280))
    media_url = Column(String, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True) # for soft delete
    is_flagged = Column(Boolean, default=False)

    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    # Likes can be a simple count or a separate table for tracking who liked what
    likes = Column(Integer, default=0)

class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = {"postgresql_partition_by": "RANGE (created_at)"}

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    parent_comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, primary_key=True)
    deleted_at = Column(DateTime, nullable=True)

    author = relationship("User", back_populates="comments")
    post = relationship("Post", back_populates="comments")
    replies = relationship("Comment", backref="parent", remote_side=[id])

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    participants = relationship("RoomParticipant", back_populates="room")
    messages = relationship("Message", back_populates="room")

class RoomParticipantRole(str, enum.Enum):
    admin = "admin"
    member = "member"
    speaker = "speaker"
    guest = "guest"

class RoomParticipant(Base):
    __tablename__ = "room_participants"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), primary_key=True)
    role = Column(Enum(RoomParticipantRole), default=RoomParticipantRole.member)

    user = relationship("User", back_populates="rooms")
    room = relationship("Room", back_populates="participants")

class Message(Base):
    __tablename__ = "messages"
    __table_args__ = {"postgresql_partition_by": "RANGE (created_at)"}
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    encrypted_content = Column(Text, nullable=False)
    is_view_once = Column(Boolean, default=False)
    viewed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, primary_key=True)

    room = relationship("Room", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id])
    recipient = relationship("User", foreign_keys=[recipient_id])

class Study(Base):
    __tablename__ = "studies"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    creator_id = Column(Integer, ForeignKey("users.id"))
    access_code = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User", back_populates="created_studies")
    questions = relationship("Question", back_populates="study")

class QuestionType(str, enum.Enum):
    qualitative = "qualitative"
    quantitative = "quantitative"

class ResearchMethod(str, enum.Enum):
    survey = "survey"
    kii = "kii"

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("studies.id"))
    text = Column(Text, nullable=False)
    question_type = Column(Enum(QuestionType))
    research_method = Column(Enum(ResearchMethod))
    order = Column(Integer)

    study = relationship("Study", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    participant_id = Column(Integer, ForeignKey("users.id"))
    response = Column(JSONB) # Flexible for different answer types
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    question = relationship("Question", back_populates="answers")
    participant = relationship("User")

# Music/Podcast Models
class Artist(Base):
    __tablename__ = "artists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    bio = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    podcasts = relationship("Podcast", back_populates="artist")

class Podcast(Base):
    __tablename__ = "podcasts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    cover_art_url = Column(String, nullable=True)
    artist_id = Column(Integer, ForeignKey("artists.id"))
    
    artist = relationship("Artist", back_populates="podcasts")
    episodes = relationship("Episode", back_populates="podcast")

class Episode(Base):
    __tablename__ = "episodes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    audio_url = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    duration = Column(Integer) # in seconds
    podcast_id = Column(Integer, ForeignKey("podcasts.id"))
    
    podcast = relationship("Podcast", back_populates="episodes")

# Calendar Models
class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("User", back_populates="created_events")
    collaborators = relationship("EventCollaborator", back_populates="event")

class EventCollaboratorStatus(str, enum.Enum):
    pending = "pending"
    committed = "committed"
    declined = "declined"

class EventCollaborator(Base):
    __tablename__ = "event_collaborators"
    event_id = Column(Integer, ForeignKey("calendar_events.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    status = Column(Enum(EventCollaboratorStatus), default=EventCollaboratorStatus.pending)

    event = relationship("CalendarEvent", back_populates="collaborators")
    user = relationship("User")

