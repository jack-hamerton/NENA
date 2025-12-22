from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app import crud, models, schemas
from app.core.deps import get_db

router = APIRouter()


@router.post("/", response_model=schemas.Study)
def create_study(
    *, 
    db: Session = Depends(get_db),
    study_in: schemas.StudyCreate,
) -> Any:
    """
    Create new study.
    """
    study = crud.study.create(db=db, obj_in=study_in)
    return study

@router.get("/", response_model=List[schemas.Study])
def read_studies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve studies.
    """
    studies = crud.study.get_multi(db, skip=skip, limit=limit)
    return studies

@router.get("/{id}", response_model=schemas.Study)
def read_study(
    *, 
    db: Session = Depends(get_db),
    id: int,
) -> Any:
    """
    Get study by ID.
    """
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study

@router.get("/code/{unique_code}", response_model=schemas.Study)
def read_study_by_code(
    *, 
    db: Session = Depends(get_db),
    unique_code: str,
) -> Any:
    """
    Get study by unique code.
    """
    study = crud.study.get_by_unique_code(db=db, unique_code=unique_code)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study

@router.post("/{study_id}/answers", response_model=List[schemas.Answer])
def create_answers(
    *, 
    db: Session = Depends(get_db),
    study_id: int,
    answers_in: schemas.AnswersCreate,
) -> Any:
    """
    Create new answers for a study.
    """
    answers = []
    for answer_in in answers_in.answers:
        answer = crud.answer.create(db=db, obj_in=schemas.AnswerCreate(text=answer_in, question_id=1, study_id=study_id))
        answers.append(answer)
    return answers

@router.get("/{study_id}/answers", response_model=List[schemas.Answer])
def read_answers(
    *, 
    db: Session = Depends(get_db),
    study_id: int,
) -> Any:
    """
    Retrieve answers for a study.
    """
    answers = crud.answer.get_multi_by_study(db, study_id=study_id)
    return answers
