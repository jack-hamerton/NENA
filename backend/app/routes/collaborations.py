
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import session
from app.models.collaboration import Collaboration
from app.schemas.collaboration import CollaborationCreate, Collaboration as CollaborationSchema
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter()

@router.post("/collaborations/", response_model=CollaborationSchema)
def create_collaboration(collaboration: CollaborationCreate, db: Session = Depends(session.get_db), current_user: User = Depends(get_current_user)):
    db_collaboration = Collaboration(**collaboration.dict(), creator_id=current_user.id)
    db.add(db_collaboration)
    db.commit()
    db.refresh(db_collaboration)
    return db_collaboration
