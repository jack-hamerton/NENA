from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.schemas.room import Room, RoomCreate
from app.crud.room import room
from app.models.user import User
from app.core.auth import get_current_user
from app.schemas.poll import PollCreate
from app.crud.poll import poll
from app.crud.poll_vote import poll_vote
from app.schemas.poll_vote import PollVoteCreate

router = APIRouter()

@router.post("/", response_model=Room)
def create_room(room_in: RoomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return room.create_with_owner(db=db, obj_in=room_in, owner_id=current_user.id)

@router.get("/{room_id}", response_model=Room)
def read_room(room_id: int, db: Session = Depends(get_db)):
    return room.get(db=db, id=room_id)

@router.post("/{room_id}/poll", response_model=int)
def create_poll(room_id: int, poll_in: PollCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    poll_in.room_id = room_id
    new_poll = poll.create(db=db, obj_in=poll_in)
    return new_poll.id

@router.post("/poll/{poll_id}/vote", response_model=int)
def vote_poll(poll_id: int, vote_in: PollVoteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    vote_in.poll_id = poll_id
    vote_in.user_id = current_user.id
    new_vote = poll_vote.create(db=db, obj_in=vote_in)
    return new_vote.id
