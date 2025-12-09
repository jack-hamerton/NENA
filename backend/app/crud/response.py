from sqlalchemy.orm import Session
from app.models.study import Response, Answer
from app.schemas.study import ResponseCreate

def create_response(db: Session, response: ResponseCreate):
    db_response = Response(study_id=response.study_id)
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    for answer_data in response.answers:
        db_answer = Answer(**answer_data.dict(), response_id=db_response.id)
        db.add(db_answer)
    db.commit()
    return db_response
