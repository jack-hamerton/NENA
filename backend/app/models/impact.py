
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Challenge(Base):
    id = Column(Integer, primary_key=True, index=True)
    collaboration_id = Column(Integer, ForeignKey('collaborations.id'))
    creator_id = Column(Integer, ForeignKey('users.id'))
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    collaboration = relationship("Collaboration", back_populates="challenges")
    creator = relationship("User")
    mitigations = relationship("Mitigation", back_populates="challenge")

class Mitigation(Base):
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey('challenges.id'))
    creator_id = Column(Integer, ForeignKey('users.id'))
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    challenge = relationship("Challenge", back_populates="mitigations")
    creator = relationship("User")
