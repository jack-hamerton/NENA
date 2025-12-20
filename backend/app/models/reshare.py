import uuid
from sqlalchemy import Column, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Reshare(Base):
    __tablename__ = "reshares"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)

    user = relationship("User")
    post = relationship("Post")

    __table_args__ = (UniqueConstraint('user_id', 'post_id', name='_user_post_uc'),)
