from sqlalchemy.orm import Session
from app.models.notification import Notification

class NotificationService:
    @staticmethod
    def get_notifications_for_user(db: Session, user_id: int):
        return db.query(Notification).filter(Notification.user_id == user_id).all()

    @staticmethod
    def mark_as_read(db: Session, notification_id: int, user_id: int):
        notification = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if notification:
            notification.read = True
            db.commit()

    @staticmethod
    def clear_read(db: Session, user_id: int):
        db.query(Notification).filter(Notification.user_id == user_id, Notification.read == True).delete()
        db.commit()
