
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime


class Podcast(Base):
    __tablename__ = "podcasts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    artist_name = Column(String, nullable=True)
    cover_art_url = Column(String, nullable=True)
    media_url = Column(String, nullable=False)
    video_thumbnail_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    transcription_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    shortcuts = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="podcasts")
    followers = relationship("Follow", back_populates="podcast")


class Follow(Base):
    __tablename__ = "follows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    podcast_id = Column(UUID(as_uuid=True), ForeignKey("podcasts.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="follows")
    podcast = relationship("Podcast", back_populates="followers")
