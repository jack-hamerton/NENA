
from pydantic import BaseModel
from typing import List, Optional, Dict
from uuid import UUID
import datetime

class QuestionBase(BaseModel):
    text: str
    type: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: UUID
    study_id: UUID

    class Config:
        orm_mode = True

class StudyBase(BaseModel):
    title: str
    description: Optional[str] = None
    methodology: Optional[str] = None

class StudyCreate(StudyBase):
    questions: List[QuestionCreate] = []
    unique_code: Optional[str] = None

class Study(StudyBase):
    id: UUID
    created_at: datetime.datetime
    unique_code: str
    questions: List[Question] = []

    class Config:
        orm_mode = True

class AnswerBase(BaseModel):
    text: str

class AnswerCreate(AnswerBase):
    question_id: UUID
    user_id: UUID

class Answer(AnswerBase):
    id: UUID
    study_id: UUID
    question_id: UUID
    user_id: UUID

    class Config:
        orm_mode = True

class AnswerSubmission(BaseModel):
    user_id: UUID
    answers: Dict[str, str]
