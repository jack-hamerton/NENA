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
    # current_user: models.User = Depends(deps.get_current_active_user) # Assuming you have user authentication
) -> Any:
    """
    Create new study.
    """
    study = crud.study.create_with_owner(db=db, obj_in=study_in, owner_id=1) # Replace 1 with current_user.id
    return study

@router.get("/", response_model=List[schemas.Study])
def read_studies(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_user),
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
    # current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get study by ID.
    """
    study = crud.study.get(db=db, id=id)
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study

@router.post("/{study_id}/answers", response_model=schemas.Answer)
def create_answer(
    *, 
    db: Session = Depends(get_db),
    study_id: int,
    answer_in: schemas.AnswerCreate,
    # current_user: models.User = Depends(deps.get_current_active_user) # Assuming you have user authentication
) -> Any:
    """
    Create new answer for a question in a study.
    """
    answer = crud.answer.create_with_owner(db=db, obj_in=answer_in, owner_id=1)
    return answer
