
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    podcast_id = Column(Integer, ForeignKey("podcasts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User")
