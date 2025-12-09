from pydantic import BaseModel
from typing import List, Optional

# Answer Schemas
class AnswerBase(BaseModel):
    question_id: int
    answer_text: str

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase):
    id: int
    response_id: int

    class Config:
        orm_mode = True

# Response Schemas
class ResponseBase(BaseModel):
    study_id: int
    answers: List[AnswerCreate]

class ResponseCreate(ResponseBase):
    pass

class Response(ResponseBase):
    id: int

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
    creator_id: int
    questions: List[Question] = []
    unique_code: str

    class Config:
        orm_mode = True

class Study(StudyInDBBase):
    pass
