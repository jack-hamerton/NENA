from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Study(Base):
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User")

class StudyQuestion(Base):
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey('studies.id'))
    question_text = Column(Text, nullable=False)

    study = relationship("Study")

class StudyResponse(Base):
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('studyquestions.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    response_text = Column(Text, nullable=False)

    question = relationship("StudyQuestion")
    user = relationship("User")
