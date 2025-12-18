from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('users.id'))
    recipient_id = Column(Integer, ForeignKey('users.id'))
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    message_type = Column(String, default='text')
    media_url = Column(String, nullable=True)
    is_disappearing = Column(Boolean, default=False)
    disappearing_duration = Column(Integer, nullable=True)
    is_view_once = Column(Boolean, default=False)
    is_encrypted = Column(Boolean, default=False)
    parent_message_id = Column(Integer, ForeignKey('messages.id'), nullable=True)

    sender = relationship("User", foreign_keys=[sender_id])
    recipient = relationship("User", foreign_keys=[recipient_id])
    parent_message = relationship("Message", remote_side=[id])
