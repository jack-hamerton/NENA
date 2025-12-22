
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app import models, crud
from app.api import deps
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user import UserService
import uuid
from pydantic import BaseModel

class FollowIntent(BaseModel):
    intent: str

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
    return user_service.create_user(db=db, user_in=user_in)


@router.get("/by-username/{username}", response_model=User)
def get_user_by_username(
    username: str,
    db: Session = Depends(deps.get_db),
):
    """
    Get user by username.
    """
    user = crud.user.get_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=User)
def get_user(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    """
    Get user by ID.
    """
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/{user_id}/follow")
def follow_user(
    user_id: uuid.UUID,
    intent: FollowIntent,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Follow a user.
    """
    user_to_follow = user_service.get_user(db, user_id)
    if not user_to_follow:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.id == user_to_follow.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    user_service.follow_user(db, follower_id=current_user.id, followed_id=user_to_follow.id, intent=intent.intent)
    return {"message": "Successfully followed user"}


@router.delete("/{user_id}/follow")
def unfollow_user(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Unfollow a user.
    """
    user_to_unfollow = user_service.get_user(db, user_id)
    if not user_to_unfollow:
        raise HTTPException(status_code=404, detail="User not found")

    user_service.unfollow_user(db, follower_id=current_user.id, followed_id=user_to_unfollow.id)
    return {"message": "Successfully unfollowed user"}


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
