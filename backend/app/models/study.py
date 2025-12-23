from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

def generate_unique_code():
    return str(uuid.uuid4())[:8]

class Study(Base):
    __tablename__ = 'studies'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    unique_code = Column(String, unique=True, index=True, default=generate_unique_code, nullable=False)

    questions = relationship("Question", back_populates="study")
    answers = relationship("Answer", back_populates="study")

class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=True)
    type = Column(String, nullable=True) # quantitative, qualitative
    study_id = Column(Integer, ForeignKey('studies.id'))

    study = relationship("Study", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = 'answers'
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey('studies.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    text = Column(Text, nullable=True)

    study = relationship("Study", back_populates="answers")
    question = relationship("Question", back_populates="answers")
