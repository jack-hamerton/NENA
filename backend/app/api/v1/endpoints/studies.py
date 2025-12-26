
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import random
import string

from app import crud, models, schemas
from app.db.session import SessionLocal
from app.websocket_manager import websocket_manager
from app.ai.services.study_analyzer import analyze_study_data

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

@router.post("/{study_id}/answers", status_code=202)
async def submit_answers(study_id: int, answers: schemas.AnswerCreate, db: Session = Depends(get_db)):
    # In a real app, you would save the answers to the database.
    print(f"Received answers for study {study_id}: {answers}")

    # In a real implementation, you would fetch all responses for the study from the database.
    # For this simulation, we'll use a static list and add the new answer.
    # We'll assume the `answers` object has a text attribute.
    all_responses = [
        "The biggest challenge is just getting started. The paperwork is overwhelming.",
        "High initial setup costs and complex regulatory procedures are significant barriers to entry for young entrepreneurs.",
        "I wish I had a mentor to guide me through the process.",
        "Finding our first customers in a competitive market was very difficult.",
    ]
    # This is a placeholder for extracting the submitted answer text.
    # In a real app, you would properly extract the text from the `answers` schema.
    if hasattr(answers, 'text'):
        all_responses.append(answers.text)

    # Trigger the analysis
    analysis_results = analyze_study_data(study_id=study_id, raw_data=all_responses)

    # Broadcast the new results to listening clients
    await websocket_manager.broadcast_to_study(study_id, analysis_results)

    return {"message": "Answers submitted successfully and analysis broadcasted."}


@router.get("/{study_id}/results")
def get_study_results(study_id: int, db: Session = Depends(get_db)):
    # This endpoint can now be a fallback or for initial data loading.
    # The real-time updates will happen via WebSocket.
    analysis_results = analyze_study_data(study_id=study_id, raw_data=[])
    return analysis_results
