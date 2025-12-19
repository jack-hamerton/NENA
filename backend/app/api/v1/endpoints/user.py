
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models
from app.api import deps
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user_service import user_service

router = APIRouter()


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

@router.get("/settings/call", response_model=dict)
def get_call_settings(
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get user's call settings.
    """
    return {"call_setting": current_user.call_setting}

@router.put("/settings/call", response_model=dict)
def update_call_settings(
    settings_in: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Update user's call settings.
    """
    user = user_service.update_user(db=db, db_obj=current_user, obj_in=settings_in)
    return {"call_setting": user.call_setting}
