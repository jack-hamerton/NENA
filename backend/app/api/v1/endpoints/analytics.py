
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas, models
from app.api import deps

router = APIRouter()

@router.get("/post-engagement", response_model=schemas.PostEngagement)
def get_post_engagement(db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    """
    Get post engagement analytics.
    """
    return crud.analytics.get_post_engagement(db=db, user_id=current_user.id)

@router.get("/user-engagement", response_model=schemas.UserEngagement)
def get_user_engagement(db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_active_user)):
    """
    Get user engagement analytics.
    """
    return crud.analytics.get_user_engagement(db=db, user_id=current_user.id)
