
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps


router = APIRouter()


@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Update a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user

@router.get("/{user_id}/follower-intent-metrics", response_model=schemas.FollowerIntentMetrics)
def get_follower_intent_metrics(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a user's follower intent metrics.
    """
    metrics = crud.user.get_follower_intent_metrics(db, user_id=user_id)
    return metrics

@router.get("/{user_id}/hashtag-metrics", response_model=List[schemas.HashtagMetrics])
def get_hashtag_metrics(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a user's hashtag metrics.
    """
    metrics = crud.post.get_user_hashtag_metrics(db, user_id=user_id)
    return metrics

@router.get("/{user_id}/badges", response_model=List[schemas.Badge])
def get_user_badges(
    user_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a user's badges.
    """
    user_badges = crud.badge.get_user_badges(db, user_id=user_id)
    return [user_badge.badge for user_badge in user_badges]


@router.get("/{user_id}/followers", response_model=List[schemas.User])
def get_user_followers(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a user's followers.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.followers

@router.get("/{user_id}/followers-of-followers", response_model=List[List[schemas.User]])
def get_followers_of_followers(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get the followers of a user's followers.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.user.get_followers_of_followers(db, user=user)


@router.get("/{user_id}/posts", response_model=List[schemas.Post])
def get_user_posts(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get a user's posts.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.posts


@router.get("/{user_id}/podcasts", response_model=List[schemas.Podcast])
def get_user_podcasts(
    user_id: int, 
    db: Session = Depends(deps.get_db)
):
    """
    Get a user's podcasts.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.podcasts
