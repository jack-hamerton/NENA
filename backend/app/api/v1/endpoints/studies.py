
from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from typing import List

from app import crud, models, schemas
from app.db.session import SessionLocal
from app.websocket_manager import websocket_manager
from app.ai.services.study_ai_service import analyze_study_data

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Study)
def create_study(study: schemas.StudyCreate, db: Session = Depends(get_db)):
    return crud.create_study(db=db, study=study)

@router.get("/", response_model=List[schemas.Study])
def get_studies(db: Session = Depends(get_db)):
    return crud.get_studies(db=db)

@router.get("/search", response_model=List[schemas.Study])
def search_studies(q: str, db: Session = Depends(get_db)):
    return crud.search_studies(db=db, query=q)

@router.get("/{study_id}/participation")
def check_participation(study_id: int, user_id: str, db: Session = Depends(get_db)):
    has_participated = crud.has_user_participated(db, study_id=study_id, user_id=user_id)
    return {"hasParticipated": has_participated}

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
async def submit_answers(study_id: int, answer_submission: schemas.AnswerSubmission, db: Session = Depends(get_db)):
    # Check if user has already participated
    if crud.has_user_participated(db, study_id=study_id, user_id=answer_submission.user_id):
        raise HTTPException(status_code=403, detail="User has already participated in this study.")

    # Save the answers
    for question_id, answer_text in answer_submission.answers.items():
        answer = schemas.AnswerCreate(text=answer_text, question_id=question_id, user_id=answer_submission.user_id)
        crud.create_answer(db, study_id=study_id, answer=answer)
    
    # Record the participation
    crud.add_participant(db, study_id=study_id, user_id=answer_submission.user_id)

    # Trigger the AI analysis for the study
    analysis_results = analyze_study_data(db_session=db, study_id=study_id)

    # Save the analysis results
    if analysis_results:
        crud.create_analysis_result(db=db, analysis_result=analysis_results, study_id=study_id)

    # Broadcast the new analysis to all listening clients for that study
    if analysis_results:
        await websocket_manager.broadcast_to_study(study_id, analysis_results)

    return {"message": "Answers submitted and analysis complete."}

@router.get("/{study_id}/answers", response_model=List[schemas.Answer])
def get_study_answers(study_id: int, db: Session = Depends(get_db)):
    # This endpoint now serves the anonymized answers to the creator
    return crud.get_answers_for_study(db, study_id=study_id)

@router.websocket("/ws/study/{study_id}")
async def websocket_endpoint(websocket: WebSocket, study_id: int):
    await websocket_manager.connect(websocket, study_id)
    try:
        while True:
            # The backend is only pushing data, so we just keep the connection alive
            await websocket.receive_text()
    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        websocket_manager.disconnect(websocket, study_id)
