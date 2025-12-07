from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.crud import analytics as crud_analytics
from app.schemas import analytics as schemas_analytics
from app.api import deps

router = APIRouter()

@router.get("/user-engagement", response_model=List[schemas_analytics.UserEngagement])
def get_user_engagement(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve user engagement metrics.
    """
    user_engagement = crud_analytics.get_user_engagement(db, skip=skip, limit=limit)
    return user_engagement

@router.get("/post-engagement", response_model=List[schemas_analytics.PostEngagement])
def get_post_engagement(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve post engagement metrics.
    """
    post_engagement = crud_analytics.get_post_engagement(db, skip=skip, limit=limit)
    return post_engagement
