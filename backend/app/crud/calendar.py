from typing import List, Optional
from sqlalchemy.orm import Session, or_
from app.crud.base import CRUDBase
from app.models.calendar import Event, EventParticipant
from app.schemas.calendar import EventCreate, EventUpdate
from datetime import datetime

class CRUDEvent(CRUDBase[Event, EventCreate, EventUpdate]):
    def create_with_participants(self, db: Session, *, obj_in: EventCreate, owner_id: int, participant_ids: List[int]) -> Event:
        db_obj = Event(title=obj_in.title, description=obj_in.description, start_time=obj_in.start_time, end_time=obj_in.end_time, owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        for user_id in participant_ids:
            participant = EventParticipant(event_id=db_obj.id, user_id=user_id)
            db.add(participant)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_events_for_user(self, db: Session, *, user_id: int) -> List[Event]:
        return (
            db.query(Event)
            .join(EventParticipant, Event.id == EventParticipant.event_id, isouter=True)
            .filter(or_(Event.owner_id == user_id, EventParticipant.user_id == user_id))
            .all()
        )

    def find_conflicting_event(self, db: Session, *, user_id: int, start_time: datetime, end_time: datetime) -> Optional[Event]:
        return (
            db.query(Event)
            .join(EventParticipant, Event.id == EventParticipant.event_id, isouter=True)
            .filter(
                or_(Event.owner_id == user_id, EventParticipant.user_id == user_id),
                (Event.start_time < end_time) & (Event.end_time > start_time)
            )
            .first()
        )

calendar = CRUDEvent(Event)
