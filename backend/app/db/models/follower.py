
from sqlalchemy import Column, Integer, ForeignKey

from app.db.base_class import Base

class Follower(Base):
    __tablename__ = "followers"

    follower_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    followed_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
