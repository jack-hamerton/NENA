
import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    # The document_id should be a unique string, like 'room-123' or 'conversation-456'
    document_id = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, default='')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_accessed = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Optional: If you want to associate documents with a user
    # owner_id = Column(Integer, ForeignKey('users.id'))
    # owner = relationship("User")
