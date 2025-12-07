from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.post import Post, PostCreate
from app.crud import post as crud_post
from app.core.security import get_current_user
from app.schemas.user import User

router = APIRouter()

@router.post("/", response_model=Post)
def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_post.create_post(db=db, post=post, user_id=current_user.id)

@router.get("/", response_model=list[Post])
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_post.get_posts(db, skip=skip, limit=limit)
