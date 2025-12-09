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
    Retrieve studies for the current user.
    """
    studies = crud.study.get_multi_by_owner(db, owner_id=1, skip=skip, limit=limit) # Replace 1 with current_user.id
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

@router.post("/responses/", response_model=schemas.Response)
def create_response(
    *, 
    db: Session = Depends(get_db),
    response_in: schemas.ResponseCreate,
) -> Any:
    """
    Create new response for a study.
    """
    response = crud.response.create_response(db=db, response=response_in)
    return response
