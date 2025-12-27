
from pydantic import BaseModel

class PostEngagement(BaseModel):
    likes: int
    comments: int
    reshares: int

class UserEngagement(BaseModel):
    new_followers: int
    profile_views: int
