
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Collaboration(Base):
    __tablename__ = "collaborations"
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String, nullable=False)
    description = Column(Text)
    work_type = Column(String)
    status = Column(String, default='open') # open, closed, in-progress
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User")
    challenges = relationship("Challenge", back_populates="collaboration")
