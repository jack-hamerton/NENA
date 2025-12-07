from typing import List, Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.db.models import CalendarEvent, EventCollaborator
from app.schemas.calendar import EventCreate, EventUpdate

class CRUDEvent(CRUDBase[CalendarEvent, EventCreate, EventUpdate]):
    def get_multi_by_owner(self, db: Session, *, owner_id: int) -> List[CalendarEvent]:
        return db.query(CalendarEvent).filter(CalendarEvent.creator_id == owner_id).all()

    def get_multi_for_user(self, db: Session, *, user_id: int) -> List[CalendarEvent]:
        return db.query(CalendarEvent).join(CalendarEvent.collaborators).filter(EventCollaborator.user_id == user_id).all()
    
    def get_collaborator(self, db: Session, *, event_id: int, user_id: int) -> Optional[EventCollaborator]:
        return db.query(EventCollaborator).filter(EventCollaborator.event_id == event_id, EventCollaborator.user_id == user_id).first()

    def add_collaborator(self, db: Session, *, event_id: int, user_id: int) -> EventCollaborator:
        collaborator = EventCollaborator(event_id=event_id, user_id=user_id)
        db.add(collaborator)
        db.commit()
        db.refresh(collaborator)
        return collaborator
    
    def update_collaborator_status(self, db: Session, *, event_id: int, user_id: int, status: str) -> Optional[EventCollaborator]:
        collaborator = self.get_collaborator(db, event_id=event_id, user_id=user_id)
        if collaborator:
            collaborator.status = status
            db.commit()
            db.refresh(collaborator)
        return collaborator

event = CRUDEvent(CalendarEvent)
