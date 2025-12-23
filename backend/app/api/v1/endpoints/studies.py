
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
import string

from app import crud, models, schemas
from app.db.session import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_unique_code():
    return ''.join(random.choices(string.digits, k=8))

@router.post("/", response_model=schemas.Study)
def create_study(study: schemas.StudyCreate, db: Session = Depends(get_db)):
    study.unique_code = generate_unique_code()
    return crud.create_study(db=db, study=study)

@router.get("/", response_model=List[schemas.Study])
def get_studies(db: Session = Depends(get_db)):
    return crud.get_studies(db=db)

@router.get("/search", response_model=List[schemas.Study])
def search_studies(q: str, db: Session = Depends(get_db)):
    return crud.search_studies(db=db, query=q)

@router.post("/{study_id}/verify")
def verify_study_access(study_id: int, code: str, db: Session = Depends(get_db)):
    study = crud.get_study_by_code(db, study_id, code)
    if not study:
        raise HTTPException(status_code=403, detail="Invalid access code")
    return {"message": "Access granted"}

@router.get("/{study_id}", response_model=schemas.Study)
def get_study(study_id: int, db: Session = Depends(get_db)):
    study = crud.get_study(db, study_id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study

@router.post("/{study_id}/answers")
def submit_answers(study_id: int, answers: schemas.AnswerCreate, db: Session = Depends(get_db)):
    # In a real application, you would save the answers to the database
    # and perform analysis.
    print(f"Received answers for study {study_id}: {answers}")
    return {"message": "Answers submitted successfully"}

@router.get("/{study_id}/results")
def get_study_results(study_id: int, db: Session = Depends(get_db)):
    # In a real application, you would fetch and analyze the results
    # from the database. This is a placeholder.
    donut_chart_data = [{ "name": "Positive", "value": 60 }, { "name": "Negative", "value": 20 }, { "name": "Neutral", "value": 20 }]
    answer_data = { "question": "What do you think of the new feature?", "answer": "I think it is great! It is very useful." }
    recommendation_data = { "recommendation": "Consider adding a tutorial to help users understand the new feature." }

    return {
        "donutChartData": donut_chart_data,
        "answerData": answer_data,
        "recommendationData": recommendation_data
    }
