
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import deps

router = APIRouter()

@router.post("/", response_model=schemas.Post)
def create_post(
    *, 
    db: Session = Depends(deps.get_db), 
    post_in: schemas.PostCreate, 
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Create new post.
    """
    post = crud.post.create_with_author(db=db, obj_in=post_in, author_id=current_user.id)
    return post

@router.get("/", response_model=List[schemas.Post])
def read_posts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve posts.
    """
    posts = crud.post.get_multi(db, skip=skip, limit=limit)
    return posts

@router.get("/{post_id}", response_model=schemas.Post)
def read_post(
    *, 
    db: Session = Depends(deps.get_db), 
    post_id: int
):
    """
    Get post by ID.
    """
    post = crud.post.get(db=db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=schemas.Post)
def update_post(
    *, 
    db: Session = Depends(deps.get_db), 
    post_id: int, 
    post_in: schemas.PostUpdate, 
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Update a post.
    """
    post = crud.post.get(db=db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    post = crud.post.update(db=db, db_obj=post, obj_in=post_in)
    return post

@router.delete("/{post_id}", response_model=schemas.Post)
def delete_post(
    *, 
    db: Session = Depends(deps.get_db), 
    post_id: int, 
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Delete a post.
    """
    post = crud.post.get(db=db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    post = crud.post.remove(db=db, id=post_id)
    return post
