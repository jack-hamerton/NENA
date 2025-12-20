from fastapi import APIRouter

from app.api.v1.endpoints import challenges, trending_audio, posts, users, utils, login

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(challenges.router, prefix="/challenges", tags=["challenges"])
api_router.include_router(trending_audio.router, prefix="/trending-audio", tags=["trending-audio"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
