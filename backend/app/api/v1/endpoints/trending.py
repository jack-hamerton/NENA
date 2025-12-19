from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import trending as trending_service

router = APIRouter()

@router.get("/hashtags")
def get_trending_hashtags(db: Session = Depends(get_db)):
    """
    Get trending hashtags.
    """
    hashtags = trending_service.get_trending_hashtags(db)
    return hashtags
