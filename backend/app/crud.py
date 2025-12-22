from sqlalchemy.orm import Session
from app import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_podcasts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Podcast).offset(skip).limit(limit).all()

def create_user_podcast(db: Session, podcast: schemas.PodcastCreate, user_id: int):
    db_podcast = models.Podcast(**podcast.dict(), owner_id=user_id)
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

def create_conversation(db: Session, conversation: schemas.ConversationCreate, creator_id: int):
    db_conversation = models.Conversation()
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)

    for user_id in conversation.participant_ids:
        user = get_user(db, user_id)
        db_conversation.participants.append(user)
    
    creator = get_user(db, creator_id)
    db_conversation.participants.append(creator)
    
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def get_conversation(db: Session, conversation_id: int):
    return db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()

def get_conversations_for_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    return user.conversations

def create_message(db: Session, message: schemas.MessageCreate, conversation_id: int, sender_id: int):
    db_message = models.Message(
        content=message.content, 
        conversation_id=conversation_id, 
        sender_id=sender_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def get_user_rooms(db: Session, user_id: int):
    user = get_user(db, user_id)
    return user.rooms

def create_room(db: Session, room: schemas.RoomCreate, creator_id: int):
    db_room = models.Room(name=room.name, creator_id=creator_id)
    db.add(db_room)
    db.commit()
    db_room.participants.append(get_user(db, creator_id))
    db.commit()
    db.refresh(db_room)
    return db_room

def add_user_to_room(db: Session, room_id: int, username: str):
    room = get_room(db, room_id)
    user = get_user_by_username(db, username)
    if user and room:
        room.participants.append(user)
        db.commit()
        db.refresh(room)
    return room


def remove_user_from_room(db: Session, room_id: int, user_id: int):
    room = get_room(db, room_id)
    user = get_user(db, user_id)
    if user and room:
        room.participants.remove(user)
        db.commit()
        db.refresh(room)
    return room

def delete_room(db: Session, room_id: int):
    room = get_room(db, room_id)
    if room:
        db.delete(room)
        db.commit()
    return room

def create_poll(db: Session, poll: schemas.PollCreate, room_id: int, creator_id: int):
    db_poll = models.Poll(question=poll.question, room_id=room_id)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)

    for option_text in poll.options:
        db_option = models.PollOption(text=option_text, poll_id=db_poll.id)
        db.add(db_option)
    
    db.commit()
    db.refresh(db_poll)
    return db_poll

def get_polls_for_room(db: Session, room_id: int):
    return db.query(models.Poll).filter(models.Poll.room_id == room_id).all()

def get_poll(db: Session, poll_id: int):
    return db.query(models.Poll).filter(models.Poll.id == poll_id).first()

def vote(db: Session, poll_option_id: int, user_id: int):
    user = get_user(db, user_id)
    poll_option = db.query(models.PollOption).filter(models.PollOption.id == poll_option_id).first()
    if user and poll_option:
        poll_option.votes.append(user)
        db.commit()
    return poll_option
