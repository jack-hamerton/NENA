import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    hashtag_id = Column(UUID(as_uuid=True), ForeignKey("hashtags.id"))
    trending_audio_id = Column(UUID(as_uuid=True), ForeignKey("trending_audio.id"))

    author = relationship("User")
    hashtag = relationship("Hashtag")
    trending_audio = relationship("TrendingAudio")
