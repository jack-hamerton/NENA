from pydantic import BaseModel

class UserEngagement(BaseModel):
    user_id: int
    full_name: str
    posts_count: int
    comments_count: int
    following_count: int
    followers_count: int

    class Config:
        orm_mode = True

class PostEngagement(BaseModel):
    post_id: int
    text: str
    author: str
    comments_count: int
    likes_count: int

    class Config:
        orm_mode = True
