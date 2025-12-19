
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import session
from app.models.impact import Challenge, Mitigation
from app.schemas.impact import ChallengeCreate, MitigationCreate, Challenge as ChallengeSchema, Mitigation as MitigationSchema
from app.models.user import User
from app.core.deps import get_current_user
from app.services.ai.impact_scoring import calculate_impact_score

router = APIRouter()

@router.post("/challenges/", response_model=ChallengeSchema)
def create_challenge(challenge: ChallengeCreate, db: Session = Depends(session.get_db), current_user: User = Depends(get_current_user)):
    db_challenge = Challenge(**challenge.dict(), creator_id=current_user.id)
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

@router.post("/mitigations/", response_model=MitigationSchema)
def create_mitigation(mitigation: MitigationCreate, db: Session = Depends(session.get_db), current_user: User = Depends(get_current_user)):
    db_mitigation = Mitigation(**mitigation.dict(), creator_id=current_user.id)
    db.add(db_mitigation)
    db.commit()
    db.refresh(db_mitigation)
    return db_mitigation

@router.get("/collaborations/{collaboration_id}/challenges", response_model=list[ChallengeSchema])
def get_collaboration_challenges(collaboration_id: int, db: Session = Depends(session.get_db)):
    challenges = db.query(Challenge).filter(Challenge.collaboration_id == collaboration_id).all()
    return challenges

@router.get("/challenges/{challenge_id}/mitigations", response_model=list[MitigationSchema])
def get_challenge_mitigations(challenge_id: int, db: Session = Depends(session.get_db)):
    mitigations = db.query(Mitigation).filter(Mitigation.challenge_id == challenge_id).all()
    return mitigations

@router.get("/users/{user_id}/impact-score", response_model=float)
def get_impact_score(user_id: int, db: Session = Depends(session.get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return calculate_impact_score(db, user)
