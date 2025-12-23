
from sqlalchemy.orm import Session
from typing import List, Optional

from app.crud.base import CRUDBase
from app.models.study import Study, Question, Answer
from app.schemas.study import StudyCreate, StudyUpdate, QuestionCreate, AnswerCreate

class CRUDStudy(CRUDBase[Study, StudyCreate, StudyUpdate]):
    def create(self, db: Session, *, obj_in: StudyCreate) -> Study:
        db_obj = Study(
            title=obj_in.title,
            description=obj_in.description,
            unique_code=obj_in.unique_code
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        # Create questions for the study
        for question_in in obj_in.questions:
            question.create_with_study(db, obj_in=question_in, study_id=db_obj.id)

        return db_obj

    def get_by_unique_code(self, db: Session, *, study_id: int, code: str) -> Optional[Study]:
        return db.query(Study).filter(Study.id == study_id, Study.unique_code == code).first()

    def search_studies(self, db: Session, *, query: str) -> List[Study]:
        return db.query(Study).filter(Study.title.ilike(f"%{query}%")).all()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Study]:
        return (
            db.query(self.model)
            .offset(skip)
            .limit(limit)
            .all()
        )

class CRUDQuestion(CRUDBase[Question, QuestionCreate, StudyUpdate]):
    def create_with_study(self, db: Session, *, obj_in: QuestionCreate, study_id: int) -> Question:
        db_obj = Question(**obj_in.dict(), study_id=study_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

class CRUDAnswer(CRUDBase[Answer, AnswerCreate, StudyUpdate]):
    def create(self, db: Session, *, obj_in: AnswerCreate) -> Answer:
        db_obj = Answer(text=obj_in.text, question_id=obj_in.question_id, study_id=obj_in.study_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_multi_by_study(
        self, db: Session, *, study_id: int, skip: int = 0, limit: int = 100
    ) -> List[Answer]:
        return (
            db.query(self.model)
            .filter(Answer.study_id == study_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

study = CRUDStudy(Study)
question = CRUDQuestion(Question)
answer = CRUDAnswer(Answer)
