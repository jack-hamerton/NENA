
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship

from app.db.base_class import Base

podcast_recommendations = Table(
    'podcast_recommendations',
    Base.metadata,
    Column('podcast_id', Integer, ForeignKey('podcasts.id'), primary_key=True),
    Column('recommendation_id', Integer, ForeignKey('podcasts.id', ondelete='CASCADE'), primary_key=True)
)


class Podcast(Base):
    __tablename__ = "podcasts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    cover_art_url = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="podcasts")
    episodes = relationship("Episode", back_populates="podcast", cascade="all, delete-orphan")
    followers = relationship("PodcastFollower", back_populates="podcast", cascade="all, delete-orphan")
    category = Column(String, index=True)
    is_featured = Column(Boolean, default=False)
    region = Column(String, index=True)
    recommendations = relationship(
        "Podcast",
        secondary=podcast_recommendations,
        primaryjoin=id == podcast_recommendations.c.podcast_id,
        secondaryjoin=id == podcast_recommendations.c.recommendation_id,
        backref="recommended_by"
    )

class Episode(Base):
    __tablename__ = "episodes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    audio_url = Column(String)
    video_url = Column(String)
    thumbnail_url = Column(String)
    transcription = Column(Text)
    notes = Column(Text)
    podcast_id = Column(Integer, ForeignKey("podcasts.id"))
    podcast = relationship("Podcast", back_populates="episodes")
    shortcuts = relationship("Shortcut", back_populates="episode", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="episode", cascade="all, delete-orphan")
    polls = relationship("Poll", back_populates="episode", cascade="all, delete-orphan")
    view_count = Column(Integer, default=0)
    listen_count = Column(Integer, default=0)


class Shortcut(Base):
    __tablename__ = "shortcuts"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)
    url = Column(String)
    episode_id = Column(Integer, ForeignKey("episodes.id"))
    episode = relationship("Episode", back_populates="shortcuts")

class PodcastFollower(Base):
    __tablename__ = "podcast_followers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    podcast_id = Column(Integer, ForeignKey("podcasts.id"))
    user = relationship("User", back_populates="podcast_following")
    podcast = relationship("Podcast", back_populates="followers")

