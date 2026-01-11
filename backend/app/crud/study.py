
from sqlalchemy.orm import Session
from app.models import Study, Question, Answer, StudyParticipant
from app.schemas import StudyCreate, QuestionCreate, AnswerCreate

def create_study(db: Session, study: StudyCreate):
    db_study = Study(title=study.title, description=study.description, methodology=study.methodology)
    db.add(db_study)
    db.commit()
    db.refresh(db_study)
    for q in study.questions:
        db_question = Question(**q.dict(), study_id=db_study.id)
        db.add(db_question)
    db.commit()
    db.refresh(db_study)
    return db_study

def get_study(db: Session, study_id: int):
    return db.query(Study).filter(Study.id == study_id).first()

def get_studies(db: Session):
    return db.query(Study).all()

def search_studies(db: Session, query: str):
    return db.query(Study).filter(Study.title.contains(query)).all()

def get_study_by_code(db: Session, study_id: int, code: str):
    return db.query(Study).filter(Study.id == study_id, Study.unique_code == code).first()

def create_answer(db: Session, study_id: int, answer: AnswerCreate):
    db_answer = Answer(**answer.dict(), study_id=study_id)
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

def get_answers_for_study(db: Session, study_id: int):
    return db.query(Answer).filter(Answer.study_id == study_id).all()

def has_user_participated(db: Session, study_id: int, user_id: str):
    return db.query(StudyParticipant).filter(
        StudyParticipant.study_id == study_id,
        StudyParticipant.user_id == user_id
    ).first() is not None

def add_participant(db: Session, study_id: int, user_id: str):
    db_participant = StudyParticipant(study_id=study_id, user_id=user_id)
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)
    return db_participant
