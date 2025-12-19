from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from typing import List, Optional
import uuid


class NotificationService:

    def create_notification(self, db: Session, notification_in: NotificationCreate) -> Notification:
        """
        Creates a new notification.

        Args:
            db: The database session.
            notification_in: The notification data.

        Returns:
            The created notification.
        """
        notification = Notification(**notification_in.dict())
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    def get_notifications_by_user(self, db: Session, user_id: uuid.UUID) -> List[Notification]:
        """
        Gets all notifications for a user.

        Args:
            db: The database session.
            user_id: The ID of the user.

        Returns:
            A list of notifications.
        """
        return db.query(Notification).filter(Notification.user_id == user_id).all()

    def mark_notification_as_read(self, db: Session, notification_id: uuid.UUID) -> Optional[Notification]:
        """
        Marks a notification as read.

        Args:
            db: The database session.
            notification_id: The ID of the notification.

        Returns:
            The updated notification, or None if not found.
        """
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if notification:
            notification.is_read = True
            db.commit()
            db.refresh(notification)
        return notification
