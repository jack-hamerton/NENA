
import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, event, select, update
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base
from app.db.base_class import Base

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resource_id = Column(UUID(as_uuid=True), nullable=False)
    resource_type = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    views = Column(Integer, default=0)

    user = relationship("User")

def track_views(mapper, connection, target):
    if hasattr(target, 'id'):
        analytics_table = Analytics.__table__
        select_stmt = select(analytics_table).where(
            analytics_table.c.resource_id == target.id
        )
        result = connection.execute(select_stmt).fetchone()

        if result:
            update_stmt = update(analytics_table).where(
                analytics_table.c.resource_id == target.id
            ).values(views=analytics_table.c.views + 1)
            connection.execute(update_stmt)
        else:
            insert_stmt = analytics_table.insert().values(
                id=uuid.uuid4(),
                resource_id=target.id,
                resource_type=target.__tablename__,
                user_id=target.author_id if hasattr(target, 'author_id') else None,
                views=1
            )
            connection.execute(insert_stmt)

# Add event listeners to the models
from app.models.post import Post
from app.models.document import Document
from app.models.poll import Poll
from app.models.study import Study
from app.models.challenge import Challenge

event.listen(Post, 'after_insert', track_views)
event.listen(Document, 'after_insert', track_views)
event.listen(Poll, 'after_insert', track_views)
event.listen(Study, 'after_insert', track_views)
event.listen(Challenge, 'after_insert', track_views)
