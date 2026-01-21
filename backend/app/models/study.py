from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

def generate_unique_code():
    return str(uuid.uuid4())[:8]

class Study(Base):
    __tablename__ = 'studies'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    unique_code = Column(String, unique=True, index=True, default=generate_unique_code, nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))

    author = relationship("User")
    questions = relationship("Question", back_populates="study")
    answers = relationship("Answer", back_populates="study")

class Question(Base):
    __tablename__ = 'questions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text = Column(String, nullable=True)
    type = Column(String, nullable=True) # quantitative, qualitative
    study_id = Column(UUID(as_uuid=True), ForeignKey('studies.id'))

    study = relationship("Study", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class Answer(Base):
    __tablename__ = 'answers'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    study_id = Column(UUID(as_uuid=True), ForeignKey('studies.id'), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey('questions.id'), nullable=False)
    text = Column(Text, nullable=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))

    author = relationship("User")
    study = relationship("Study", back_populates="answers")
    question = relationship("Question", back_populates="answers")
