from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Post])
def read_posts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve posts.
    """
    posts = crud.post.get_multi(db, skip=skip, limit=limit)
    return posts


@router.post("/", response_model=schemas.Post)
def create_post(
    *, 
    db: Session = Depends(deps.get_db),
    post_in: schemas.PostCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new post.
    """
    post = crud.post.create_with_owner(db, obj_in=post_in, user_id=current_user.id)
    return post

@router.post("/{post_id}/poll", response_model=schemas.Poll)
def create_poll_for_post(
    post_id: uuid.UUID,
    *, 
    db: Session = Depends(deps.get_db),
    poll_in: schemas.PollCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a poll for a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    poll = crud.poll.create_with_options(db, obj_in=poll_in, post_id=post_id)
    return poll

@router.post("/{post_id}/reshare", response_model=schemas.Reshare)
def reshare_post(
    post_id: uuid.UUID,
    *, 
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Reshare a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    reshare_in = schemas.ReshareCreate(post_id=post_id)
    reshare = crud.reshare.create_with_owner(db, obj_in=reshare_in, user_id=current_user.id)
    return reshare

@router.post("/{post_id}/quote-post", response_model=schemas.QuotePost)
def quote_post(
    post_id: uuid.UUID,
    *, 
    db: Session = Depends(deps.get_db),
    quote_post_in: schemas.QuotePostCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Quote a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    quote_post = crud.quote_post.create_with_owner(db, obj_in=quote_post_in, user_id=current_user.id)
    return quote_post
