from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class Study(Base):
    __tablename__ = 'studies'
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    unique_code = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))

    creator = relationship("User")
    questions = relationship("Question", back_populates="study")
    responses = relationship("Response", back_populates="study")

class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=True)
    type = Column(String, nullable=True) # quantitative, qualitative
    study_id = Column(Integer, ForeignKey('studies.id'))

    study = relationship("Study", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Response(Base):
    __tablename__ = 'responses'
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey('studies.id'))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    study = relationship("Study", back_populates="responses")
    answers = relationship("Answer", back_populates="response")

class Answer(Base):
    __tablename__ = 'answers'
    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, ForeignKey('responses.id'), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    answer_text = Column(Text, nullable=True)

    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")
