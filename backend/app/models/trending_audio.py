import uuid
from sqlalchemy import Column, String
from app.db.base_class import Base

class TrendingAudio(Base):
    __tablename__ = "trending_audio"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    artist = Column(String)
    url = Column(String, nullable=False)
