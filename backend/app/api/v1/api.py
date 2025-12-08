from fastapi import APIRouter

from app.api.v1.endpoints import login, users, rooms, posts
from app.ai.endpoints import ai

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(posts.router, prefix="", tags=["posts"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
