from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.db.base_class import Base
from app.models.user import User
from typing import List
import datetime

conversation_user_association = Table(
    "conversation_user",
    Base.metadata,
    Column("conversation_id", Integer, ForeignKey("conversations.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    participants: Mapped[List[User]] = relationship(secondary=conversation_user_association, lazy="selectin")
