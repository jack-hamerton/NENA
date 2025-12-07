
import enum
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base

class Study(Base):
    __tablename__ = 'studies'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    methodology = Column(Enum('KII', 'Survey', name='methodology_enum'))

    questions = relationship("Question", back_populates="study")

class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True)
    text = Column(String)
    type = Column(Enum('qualitative', 'quantitative', name='question_type_enum'))
    study_id = Column(Integer, ForeignKey('studies.id'))

    study = relationship("Study", back_populates="questions")
