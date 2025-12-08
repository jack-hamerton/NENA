import sqlalchemy as sa
from sqlalchemy.orm import relationship
from ..db.base_class import Base

class Poll(Base):
    __tablename__ = "polls"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    question = sa.Column(sa.String, index=True)
    options = sa.Column(sa.JSON, nullable=False)
    duration_minutes = sa.Column(sa.Integer)
    created_at = sa.Column(sa.DateTime, default=sa.func.now())
    post_id = sa.Column(sa.Integer, sa.ForeignKey("posts.id"))
    post = relationship("Post", back_populates="polls")
    room_id = sa.Column(sa.Integer, sa.ForeignKey("rooms.id"))
    room = relationship("Room", back_populates="polls")
