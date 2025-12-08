
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from deps import get_db
from models import User

router = APIRouter()

@router.get("/user-count")
def get_user_count(db: Session = Depends(get_db)):
    return {"user_count": db.query(User).count()}
