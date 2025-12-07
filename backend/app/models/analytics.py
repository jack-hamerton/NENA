from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class UserEngagementView(Base):
    __tablename__ = 'user_engagement_view'
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    posts_count = Column(Integer)
    comments_count = Column(Integer)
    following_count = Column(Integer)
    followers_count = Column(Integer)

class PostEngagementView(Base):
    __tablename__ = 'post_engagement_view'
    post_id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    author = Column(String)
    comments_count = Column(Integer)
    likes_count = Column(Integer)
