
from sqlalchemy.orm import Session
from app.models.study import Study, Question
from app.schemas.study import StudyCreate

def create_study(db: Session, study: StudyCreate):
    db_study = Study(
        title=study.title,
        description=study.description
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
