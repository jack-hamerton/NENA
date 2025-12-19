
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Podcast(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    cover_art_url = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="podcasts")
    episodes = relationship("Episode", back_populates="podcast")

class Episode(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    audio_url = Column(String)
    video_url = Column(String)
    thumbnail_url = Column(String)
    transcription = Column(Text)
    podcast_id = Column(Integer, ForeignKey("podcasts.id"))
    podcast = relationship("Podcast", back_populates="episodes")
    shortcuts = relationship("Shortcut", back_populates="episode")

class Shortcut(Base):
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)
    url = Column(String)
    episode_id = Column(Integer, ForeignKey("episodes.id"))
    episode = relationship("Episode", back_populates="shortcuts")
