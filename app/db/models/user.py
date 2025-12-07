
from sqlalchemy import Boolean, Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, index=True)
    country_code = Column(String, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)

    posts = relationship("Post", back_populates="owner")
    comments = relationship("Comment", back_populates="owner")
    owned_rooms = relationship("Room", back_populates="owner")
    rooms = relationship(
        "Room", secondary="room_participants", back_populates="participants"
    )
    studies = relationship("Study", back_populates="owner")
    answers = relationship("Answer", back_populates="owner")
    challenges = relationship("Challenge", back_populates="owner")
    mitigations = relationship("Mitigation", back_populates="owner")
    impacts = relationship("Impact", back_populates="owner")

    __table_args__ = (UniqueConstraint('phone_number', 'country_code', name='_phone_country_uc'),)
