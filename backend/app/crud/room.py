
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.room import Room, RoomParticipant
from app.schemas.room import RoomCreate, RoomUpdate
from typing import List

class CRUDRoom(CRUDBase[Room, RoomCreate, RoomUpdate]):
    def create_with_creator(self, db: Session, *, obj_in: RoomCreate, creator_id: int) -> Room:
        db_obj = Room(name=obj_in.name, creator_id=creator_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        # Add creator as a participant
        self.add_participant(db, room_id=db_obj.id, user_id=creator_id)
        return db_obj

    def add_participant(self, db: Session, *, room_id: int, user_id: int) -> RoomParticipant:
        participant = RoomParticipant(room_id=room_id, user_id=user_id)
        db.add(participant)
        db.commit()
        db.refresh(participant)
        return participant

    def get_participants(self, db: Session, *, room_id: int):
        return db.query(RoomParticipant).filter(RoomParticipant.room_id == room_id).all()
    
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Room]:
        return (
            db.query(self.model)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def remove_participant(self, db: Session, *, room_id: int, user_id: int):
        participant = db.query(RoomParticipant).filter(RoomParticipant.room_id == room_id, RoomParticipant.user_id == user_id).first()
        if participant:
            db.delete(participant)
            db.commit()
        return participant

room = CRUDRoom(Room)
