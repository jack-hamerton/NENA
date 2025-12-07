
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine
from models.chat import RoomRole

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Placeholder for a real authentication system
def get_current_user(db: Session = Depends(get_db)):
    # In a real application, this would involve decoding a JWT token
    # or validating a session cookie.
    # For now, we'll just return the first user in the database.
    user = db.query(models.User).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/rooms/", response_model=schemas.Room)
def create_room(
    room: schemas.RoomCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_room(db=db, room=room, user_id=current_user.id)


@app.get("/rooms/", response_model=list[schemas.Room])
def read_rooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    rooms = crud.get_rooms(db, skip=skip, limit=limit)
    return rooms


@app.get("/rooms/{room_id}", response_model=schemas.Room)
def read_room(room_id: int, db: Session = Depends(get_db)):
    db_room = crud.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return db_room

@app.post("/rooms/{room_id}/messages/", response_model=schemas.Message)
def create_message_for_room(
    room_id: int,
    message: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Ensure the user is a member of the room before allowing them to post
    if not any(membership.room_id == room_id for membership in current_user.room_associations):
        raise HTTPException(status_code=403, detail="Not a member of this room")
    return crud.create_message(db=db, message=message)


@app.get("/rooms/{room_id}/messages/", response_model=list[schemas.Message])
def read_messages_for_room(
    room_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    messages = crud.get_messages(db, room_id=room_id, skip=skip, limit=limit)
    return messages

@app.post("/rooms/{room_id}/members/{user_id}", response_model=schemas.RoomMembershipSchema)
def add_user_to_room(
    room_id: int, user_id: int, role: RoomRole = RoomRole.MEMBER, db: Session = Depends(get_db)
):
    return crud.add_user_to_room(db=db, room_id=room_id, user_id=user_id, role=role)

@app.get("/rooms/{room_id}/members", response_model=list[schemas.RoomMembershipSchema])
def get_room_members(room_id: int, db: Session = Depends(get_db)):
    return crud.get_room_members(db, room_id=room_id)

@app.post("/posts/", response_model=schemas.Post)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_post(db=db, post=post, author_id=current_user.id)


@app.get("/posts/", response_model=list[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts
