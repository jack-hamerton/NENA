import asyncio
from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app import crud, schemas
from app.db.session import SessionLocal
from app.websockets import manager


async def send_event_reminders():
    db: Session = SessionLocal()
    now = datetime.utcnow()
    fifteen_minutes_from_now = now + timedelta(minutes=15)
    events = crud.event.get_events_starting_soon(db, start_time=now, end_time=fifteen_minutes_from_now)
    for event in events:
        notification = schemas.Notification(
            type="event_reminder",
            payload=schemas.Event.from_orm(event).dict()
        )
        await manager.send_personal_message(notification.dict(), event.owner_id)
        for collaborator in event.collaborators:
            await manager.send_personal_message(notification.dict(), collaborator.id)
    db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: asyncio.run(send_event_reminders()), 'interval', minutes=1)
    scheduler.start()
