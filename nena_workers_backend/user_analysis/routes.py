
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from nena_workers_backend.deps import get_db
from nena_workers_backend.models import User

router = APIRouter()

@router.get("/user-count")
def get_user_count(db: Session = Depends(get_db)):
    return {"user_count": db.query(User).count()}
