
import sqlalchemy as sa
from sqlalchemy.orm import relationship
from ..db.base_class import Base

class Podcast(Base):
    __tablename__ = "podcasts"

    id = sa.Column(sa.Integer, primary_key=True, index=True)
    title = sa.Column(sa.String, index=True)
    artist_name = sa.Column(sa.String, index=True)
    description = sa.Column(sa.String, index=True)
    s3_key = sa.Column(sa.String, unique=True, index=True)
    cover_art_url = sa.Column(sa.String, nullable=True)
    creator_id = sa.Column(sa.Integer, sa.ForeignKey("users.id"))
    creator = relationship("User", back_populates="podcasts")
