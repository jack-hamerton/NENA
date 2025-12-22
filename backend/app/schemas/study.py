from pydantic import BaseModel
from typing import List, Optional

# Answer Schemas
class AnswerBase(BaseModel):
    text: str

class AnswerCreate(AnswerBase):
    question_id: int
    study_id: int

class AnswersCreate(BaseModel):
    answers: List[str]

class Answer(AnswerBase):
    id: int
    question_id: int
    study_id: int

    class Config:
        orm_mode = True

# Question Schemas
class QuestionBase(BaseModel):
    text: str
    type: str

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(QuestionBase):
    pass

class QuestionInDBBase(QuestionBase):
    id: int
    study_id: int

    class Config:
        orm_mode = True

class Question(QuestionInDBBase):
    pass

# Study Schemas
class StudyBase(BaseModel):
    title: str
    description: Optional[str] = None

class StudyCreate(StudyBase):
    questions: List[QuestionCreate] = []

class StudyUpdate(StudyBase):
    pass

class StudyInDBBase(StudyBase):
    id: int
    questions: List[Question] = []
    unique_code: str

    class Config:
        orm_mode = True

class Study(StudyInDBBase):
    pass
