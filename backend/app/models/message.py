import datetime
import uuid
from sqlalchemy import (
    Column, Text, DateTime, ForeignKey, String, Boolean, Integer
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    recipient_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    message_type = Column(String, default='text')
    media_url = Column(String, nullable=True)
    is_disappearing = Column(Boolean, default=False)
    disappearing_duration = Column(Integer, nullable=True)
    is_view_once = Column(Boolean, default=False)
    is_encrypted = Column(Boolean, default=False)
    parent_message_id = Column(UUID(as_uuid=True), ForeignKey('messages.id'), nullable=True)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    recipient = relationship("User", foreign_keys=[recipient_id], back_populates="received_messages")
    parent_message = relationship("Message", remote_side=[id])
