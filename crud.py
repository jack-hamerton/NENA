
from sqlalchemy.orm import Session
import models
import schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, username=user.username, password_hash=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Room).offset(skip).limit(limit).all()

def create_room(db: Session, room: schemas.RoomCreate, user_id: int):
    db_room = models.Room(name=room.name)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    # Add the creator as the owner of the room
    db_membership = models.RoomMembership(
        user_id=user_id, room_id=db_room.id, role=models.RoomRole.OWNER
    )
    db.add(db_membership)
    db.commit()
    db.refresh(db_room)

    return db_room

def get_messages(db: Session, room_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Message).filter(models.Message.room_id == room_id).offset(skip).limit(limit).all()

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def add_user_to_room(db: Session, user_id: int, room_id: int, role: models.RoomRole = models.RoomRole.MEMBER):
    membership = models.RoomMembership(user_id=user_id, room_id=room_id, role=role)
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership

def get_room_members(db: Session, room_id: int):
    return db.query(models.RoomMembership).filter(models.RoomMembership.room_id == room_id).all()

def create_post(db: Session, post: schemas.PostCreate, author_id: int):
    db_post = models.Post(**post.dict(), author_id=author_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()

