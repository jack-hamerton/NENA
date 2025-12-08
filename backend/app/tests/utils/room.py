from sqlalchemy.orm import Session
from app.crud.room import room
from app.schemas.room import RoomCreate
from app.tests.utils.utils import random_lower_string

def create_random_room(db: Session, owner_id: int):
    name = random_lower_string()
    description = random_lower_string()
    room_in = RoomCreate(name=name, description=description, owner_id=owner_id)
    return room.create_with_owner(db, obj_in=room_in, owner_id=owner_id)
