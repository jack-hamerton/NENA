import sqlalchemy as sa
from sqlalchemy.orm import relationship
from ..db.base_class import Base

class PollVote(Base):
    __tablename__ = "poll_votes"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    user_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"))
    poll_id = sa.Column(sa.Integer, sa.ForeignKey("polls.id"))
    option = sa.Column(sa.String, nullable=False)
    created_at = sa.Column(sa.DateTime, default=sa.func.now())

    user = relationship("User", back_populates="poll_votes")
    poll = relationship("Poll", back_populates="poll_votes")
