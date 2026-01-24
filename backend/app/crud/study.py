
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.study import Study, Question, Answer
from app.schemas.study import StudyCreate, AnswerCreate

def create_study(db: Session, study: StudyCreate):
    db_study = Study(
        title=study.title,
        description=study.description,
        methodology=study.methodology
    )
    db.add(db_study)
    db.commit()
    db.refresh(db_study)

    for question_data in study.questions:
        db_question = Question(
            text=question_data.text,
            type=question_data.type,
            study_id=db_study.id
        )
        db.add(db_question)
    
    db.commit()
    db.refresh(db_study)
    return db_study

def get_studies(db: Session):
    """Get all studies"""
    return db.query(Study).all()

def get_study(db: Session, study_id: UUID):
    """Get a study by ID"""
    return db.query(Study).filter(Study.id == study_id).first()

def search_studies(db: Session, query: str):
    """Search studies by title or description"""
    return db.query(Study).filter(
        (Study.title.ilike(f"%{query}%")) | 
        (Study.description.ilike(f"%{query}%"))
    ).all()

def get_study_by_code(db: Session, study_id: UUID, code: str):
    """Get study by ID and unique code"""
    return db.query(Study).filter(
        (Study.id == study_id) & (Study.unique_code == code)
    ).first()

def create_answer(db: Session, study_id: UUID, answer: AnswerCreate):
    """Create an answer for a study question"""
    db_answer = Answer(
        study_id=study_id,
        question_id=answer.question_id,
        text=answer.text,
        author_id=answer.user_id
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

def get_answers_for_study(db: Session, study_id: UUID):
    """Get all answers for a study"""
    return db.query(Answer).filter(Answer.study_id == study_id).all()

def has_user_participated(db: Session, study_id: UUID, user_id: UUID):
    """Check if a user has already participated in a study"""
    return db.query(Answer).filter(
        (Answer.study_id == study_id) & (Answer.author_id == user_id)
    ).first() is not None

def add_participant(db: Session, study_id: UUID, user_id: UUID):
    """Record user participation (this is done via creating answers)"""
    # The actual participation is recorded when answers are created
    pass

def create_analysis_result(db: Session, analysis_result, study_id: UUID):
    """Create/store analysis results for a study"""
    # Stub function - would integrate with actual analysis service
    pass

