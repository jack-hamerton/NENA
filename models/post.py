
import datetime
from sqlalchemy import (
    Column,
    Integer,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from .base import Base

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")

    def __repr__(self):
        return f"<Post {self.id}>"
