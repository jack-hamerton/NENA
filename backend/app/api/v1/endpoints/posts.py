
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List
import uuid

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/for-you", response_model=List[schemas.Post])
def read_for_you_feed(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve the "For You" feed for the current user.
    """
    posts = crud.post.get_multi_excluding_owner(db, user_id=current_user.id, limit=20)
    return posts


@router.get("/following", response_model=List[schemas.Post])
def read_following_feed(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve the "Following" feed for the current user.
    """
    following_users = [f.followed for f in current_user.following]
    following_user_ids = [user.id for user in following_users]

    posts = crud.post.get_multi_by_owners(db, user_ids=following_user_ids)
    return posts


@router.get("/by-user/{user_id}", response_model=List[schemas.Post])
def read_posts_by_user(
    user_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all posts for a specific user.
    """
    posts = crud.post.get_multi_by_owner(db, user_id=user_id, skip=skip, limit=limit)
    return posts


@router.get("/{post_id}", response_model=schemas.Post)
def read_post(
    post_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get post by ID.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", response_model=schemas.Post)
def create_post(
    post_in: schemas.PostCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new post.
    """
    post = crud.post.create_with_owner(db, obj_in=post_in, user_id=current_user.id)
    return post


@router.post("/{post_id}/report", response_model=schemas.Post)
def report_post(
    post_id: uuid.UUID,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Report a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    # In a real application, you would have a more robust reporting system.
    # For now, we will just mark the post as reported.
    return crud.post.update(db, db_obj=post, obj_in={"is_reported": True})
