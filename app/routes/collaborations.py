
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db.session import get_db

router = APIRouter()

@router.post("/challenges/", response_model=schemas.Challenge)
def create_challenge(
    challenge: schemas.ChallengeCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1 # Placeholder for auth
):
    return crud.collaboration.create_challenge(db, challenge, current_user_id)

@router.get("/challenges/", response_model=list[schemas.Challenge])
def read_challenges(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return crud.collaboration.get_challenges(db, skip, limit)

@router.post("/mitigations/", response_model=schemas.Mitigation)
def create_mitigation(
    mitigation: schemas.MitigationCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1 # Placeholder for auth
):
    return crud.collaboration.create_mitigation(db, mitigation, current_user_id)

@router.get("/mitigations/", response_model=list[schemas.Mitigation])
def read_mitigations(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return crud.collaboration.get_mitigations(db, skip, limit)

@router.post("/impacts/", response_model=schemas.Impact)
def create_impact(
    impact: schemas.ImpactCreate,
    db: Session = Depends(get_db),
    current_user_id: int = 1 # Placeholder for auth
):
    return crud.collaboration.create_impact(db, impact, current_user_id)

@router.get("/impacts/", response_model=list[schemas.Impact])
def read_impacts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return crud.collaboration.get_impacts(db, skip, limit)
