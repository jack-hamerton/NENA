
from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(UUID(as_uuid=True), ForeignKey("studies.id"))
    sentiment = Column(JSON)
    themes = Column(JSON)
    key_quotes = Column(JSON)

    study = relationship("Study", back_populates="analysis_results")
