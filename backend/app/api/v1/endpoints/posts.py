
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any, List
import random
import uuid

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

# ... (existing endpoints) ...

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
