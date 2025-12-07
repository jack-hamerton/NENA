
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()

@router.get("/user-engagement")
def get_user_engagement(db: Session = Depends(get_db)):
    query = """
    SELECT * FROM user_engagement_view;
    """
    result = db.execute(query).fetchall()
    return result

@router.get("/post-engagement")
def get_post_engagement(db: Session = Depends(get_db)):
    query = """
    SELECT * FROM post_engagement_view;
    """
    result = db.execute(query).fetchall()
    return result
