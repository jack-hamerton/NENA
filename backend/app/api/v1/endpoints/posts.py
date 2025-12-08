
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app import schemas
from backend.app.core import deps, security
from backend.app.db.models import User
from backend.app.services import post_service, like_service, comment_service

router = APIRouter()


@router.get("/feed/for-you", response_model=List[schemas.Post])
def get_for_you_feed(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return post_service.get_for_you_feed(db, current_user)


@router.get("/feed/following", response_model=List[schemas.Post])
def get_following_feed(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return post_service.get_following_feed(db, current_user)


@router.post("/posts", response_model=schemas.Post)
def create_post(
    post_in: schemas.PostCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return post_service.create_post(db, post_in, current_user)


@router.post("/posts/{post_id}/bookmark", response_model=schemas.Bookmark)
def bookmark_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return post_service.bookmark_post(db, post_id, current_user)


@router.delete("/posts/{post_id}/bookmark", response_model=schemas.Bookmark)
def unbookmark_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return post_service.unbookmark_post(db, post_id, current_user)


@router.post("/posts/{post_id}/like", response_model=schemas.Like)
def like_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return like_service.like_post(db, post_id, current_user)


@router.delete("/posts/{post_id}/like", response_model=schemas.Like)
def unlike_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return like_service.unlike_post(db, post_id, current_user)


@router.get("/posts/{post_id}/likes", response_model=List[schemas.Like])
def get_likes_for_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
):
    return like_service.get_likes_for_post(db, post_id)


@router.post("/posts/{post_id}/comments", response_model=schemas.Comment)
def create_comment(
    post_id: int,
    comment_in: schemas.CommentCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    return comment_service.create_comment(db, comment_in, current_user, post_id)


@router.get("/posts/{post_id}/comments", response_model=List[schemas.Comment])
def get_comments_for_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
):
    return comment_service.get_comments_for_post(db, post_id)
