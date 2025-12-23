
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Comment)
def create_comment(
    *,
    db: Session = Depends(deps.get_db),
    comment_in: schemas.CommentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Create new comment.
    """
    comment = crud.comment.create_comment(
        db=db, comment=comment_in, user_id=current_user.id
    )
    return comment


@router.get("/{comment_id}", response_model=schemas.CommentWithReplies)
def read_comment(
    *,
    db: Session = Depends(deps.get_db),
    comment_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get comment by ID.
    """
    comment = crud.comment.get_comment(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment


@router.get("/episode/{episode_id}", response_model=List[schemas.CommentWithReplies])
def read_comments_for_episode(
    *,
    db: Session = Depends(deps.get_db),
    episode_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Retrieve comments for an episode.
    """
    comments = crud.comment.get_comments_for_episode(
        db, episode_id=episode_id, skip=skip, limit=limit
    )
    return comments


@router.put("/{comment_id}", response_model=schemas.Comment)
def update_comment(
    *,
    db: Session = Depends(deps.get_db),
    comment_id: int,
    comment_in: schemas.CommentUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Update a comment.
    """
    comment = crud.comment.get_comment(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comment = crud.comment.update_comment(
        db=db, comment_id=comment_id, comment=comment_in
    )
    return comment


@router.delete("/{comment_id}", response_model=schemas.Comment)
def delete_comment(
    *,
    db: Session = Depends(deps.get_db),
    comment_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Delete a comment.
    """
    comment = crud.comment.get_comment(db=db, comment_id=comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comment = crud.comment.delete_comment(db=db, comment_id=comment_id)
    return comment
