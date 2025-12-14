from fastapi import APIRouter

from app.api.v1.endpoints import login, users, rooms, posts, studies, calendar, pnv
from app.routes import messages, discover, ai, analytics

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(pnv.router, tags=["pnv"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(posts.router, prefix="", tags=["posts"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(studies.router, prefix="/studies", tags=["studies"])
api_router.include_router(messages.router, prefix="", tags=["messages"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
api_router.include_router(discover.router, prefix="", tags=["discover"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
