from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services.profile import ProfileService
from app.schemas.profile import Profile, ProfileCreate, ProfileUpdate
import uuid

router = APIRouter()
profile_service = ProfileService()


@router.post("/", response_model=Profile)
def create_profile(
    profile_in: ProfileCreate,
    db: Session = Depends(deps.get_db),
):
    return profile_service.create_profile(db=db, profile_in=profile_in)


@router.get("/{user_id}", response_model=Profile)
def get_profile(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    profile = profile_service.get_profile_by_user_id(db=db, user_id=user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/{user_id}", response_model=Profile)
def update_profile(
    user_id: uuid.UUID,
    profile_in: ProfileUpdate,
    db: Session = Depends(deps.get_db),
):
    profile = profile_service.update_profile(db=db, user_id=user_id, profile_in=profile_in)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
