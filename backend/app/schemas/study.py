
from pydantic import BaseModel
from typing import List, Optional, Dict
import datetime

class QuestionBase(BaseModel):
    text: str
    type: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class Question(QuestionBase):
    id: int
    study_id: int

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
    id: int
    created_at: datetime.datetime
    unique_code: str
    questions: List[Question] = []

    class Config:
        orm_mode = True

class AnswerBase(BaseModel):
    text: str

class AnswerCreate(AnswerBase):
    question_id: int
    user_id: int

class Answer(AnswerBase):
    id: int
    study_id: int
    question_id: int
    user_id: int

    class Config:
        orm_mode = True

class AnswerSubmission(BaseModel):
    user_id: int
    answers: Dict[int, str]
