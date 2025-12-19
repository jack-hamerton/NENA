from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import User, UserCreate
from app.services.user import UserService

router = APIRouter()
user_service = UserService()


@router.post("/", response_model=User)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(deps.get_db),
):
    """
    Create new user.
    """
    user = user_service.create_user(db=db, user_in=user_in)
    return user
