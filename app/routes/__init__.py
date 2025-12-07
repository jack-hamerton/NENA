
from fastapi import APIRouter

from app.routes import users, posts, comments, rooms, studies, collaborations, analytics, auth

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(studies.router, prefix="/studies", tags=["studies"])
api_router.include_router(collaborations.router, prefix="/collaborations", tags=["collaborations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
