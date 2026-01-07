
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db import Base

# Association table for the many-to-many relationship between posts and hashtags
post_hashtag_association = Table(
    'post_hashtag', Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id')), 
    Column('hashtag_id', Integer, ForeignKey('hashtags.id'))
)

class Hashtag(Base):
    __tablename__ = 'hashtags'
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, unique=True, index=True)

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, index=True)
    author_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())

    author = relationship("User")
    likes = relationship("Like", back_populates="post")
    comments = relationship("Comment", back_populates="post")
    hashtags = relationship("Hashtag", secondary=post_hashtag_association)
