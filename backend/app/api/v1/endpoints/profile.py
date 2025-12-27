from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services.profile import ProfileService
from app.schemas.profile import Profile, ProfileCreate, ProfileUpdate
from app.models.user import User
from app.models.follower import Follower
from app.schemas.follower import IntentEnum
from collections import Counter
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

@router.get("/{user_id}/follower-web")
def get_follower_web(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all followers with their intents
    followers = (
        db.query(User.id, User.username, Follower.intent)
        .join(Follower, User.id == Follower.follower_id)
        .filter(Follower.followed_id == user_id)
        .all()
    )

    # Structure the follower data for the graph
    follower_list = [
        {"id": str(f.id), "name": f.username, "category": f.intent or "Other"}
        for f in followers
    ]

    # Calculate the metrics
    intent_counts = Counter(f["category"] for f in follower_list)

    # Construct the final response
    response = {
        "user": {
            "id": str(user.id),
            "name": user.username,
            "followers": follower_list,
        },
        "followerIntentMetrics": dict(intent_counts),
    }

    return response
