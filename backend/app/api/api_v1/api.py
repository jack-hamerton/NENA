
from fastapi import APIRouter

from app.api.api_v1.endpoints import podcasts, comments, polls

api_router = APIRouter()
api_router.include_router(podcasts.router, prefix="/podcasts", tags=["podcasts"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(polls.router, prefix="/polls", tags=["polls"])
