from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
import datetime

from app.crud.base import CRUDBase
from app.db.models import CalendarEvent, EventCollaborator
from app.schemas.calendar import EventCreate, EventUpdate, CollaboratorStatus

class CRUDEvent(CRUDBase[CalendarEvent, EventCreate, EventUpdate]):
    def get_multi_by_owner(self, db: Session, *, owner_id: int) -> List[CalendarEvent]:
        return db.query(CalendarEvent).filter(CalendarEvent.creator_id == owner_id).all()

    def get_multi_for_user(self, db: Session, *, user_id: int) -> List[CalendarEvent]:
        # Events where the user is a collaborator with status 'Accepted'
        collaborator_events = db.query(CalendarEvent).join(CalendarEvent.collaborators).filter(
            EventCollaborator.user_id == user_id,
            EventCollaborator.status == CollaboratorStatus.Accepted
        ).all()

        # Events created by the user
        creator_events = self.get_multi_by_owner(db, owner_id=user_id)

        return collaborator_events + creator_events

    def get_events_starting_soon(self, db: Session, *, start_time: datetime, end_time: datetime) -> List[CalendarEvent]:
        return db.query(CalendarEvent).filter(
            CalendarEvent.start_time >= start_time,
            CalendarEvent.start_time <= end_time
        ).all()

    def is_user_busy(self, db: Session, *, user_id: int, start_time: datetime, end_time: datetime) -> bool:
        """Check if the user has any overlapping events."""
        overlapping_events = db.query(CalendarEvent).filter(
            or_(CalendarEvent.creator_id == user_id, CalendarEvent.collaborators.any(user_id=user_id, status=CollaboratorStatus.Accepted)),
            or_(
                (CalendarEvent.start_time < end_time) & (CalendarEvent.end_time > start_time),
            )
        ).count()
        return overlapping_events > 0

    def find_available_slots(self, db: Session, *, user_id: int, date: datetime.date) -> List[dict]:
        """Find available 1-hour slots for a given day."""
        user_events = self.get_multi_for_user(db, user_id=user_id)
        
        start_of_day = datetime.datetime.combine(date, datetime.time(9, 0)) # 9 AM
        end_of_day = datetime.datetime.combine(date, datetime.time(17, 0)) # 5 PM

        # Filter events for the given day
        day_events = [e for e in user_events if e.start_time.date() == date]
        day_events.sort(key=lambda e: e.start_time)

        available_slots = []
        current_time = start_of_day

        for event in day_events:
            if current_time < event.start_time:
                while current_time + datetime.timedelta(hours=1) <= event.start_time:
                    available_slots.append({'start': current_time, 'end': current_time + datetime.timedelta(hours=1)})
                    current_time += datetime.timedelta(hours=1)
            current_time = max(current_time, event.end_time)
        
        while current_time + datetime.timedelta(hours=1) <= end_of_day:
            available_slots.append({'start': current_time, 'end': current_time + datetime.timedelta(hours=1)})
            current_time += datetime.timedelta(hours=1)

        return available_slots
    
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
