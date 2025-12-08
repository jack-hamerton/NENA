from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.schemas.post import Post, PostCreate
from app.crud.post import post
from app.models.user import User
from app.core.auth import get_current_user
from app.schemas.poll import PollCreate
from app.crud.poll import poll
from app.crud.poll_vote import poll_vote
from app.schemas.poll_vote import PollVoteCreate

router = APIRouter()

@router.post("/", response_model=Post)
def create_post(post_in: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return post.create_with_owner(db=db, obj_in=post_in, owner_id=current_user.id)

@router.get("/{post_id}", response_model=Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    return post.get(db=db, id=post_id)

@router.post("/{post_id}/poll", response_model=int)
def create_poll(post_id: int, poll_in: PollCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    poll_in.post_id = post_id
    new_poll = poll.create(db=db, obj_in=poll_in)
    return new_poll.id
