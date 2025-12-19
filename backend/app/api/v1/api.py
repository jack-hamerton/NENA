from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, rooms, posts, studies, calendar, pnv, messages, discover, ai, analytics, impact, social, profile, conversations, trending

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(pnv.router, tags=["pnv"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(rooms.router, prefix="/rooms", tags=["rooms"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(studies.router, prefix="/studies", tags=["studies"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["calendar"])
api_router.include_router(discover.router, prefix="/discover", tags=["discover"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(impact.router, prefix="/impact", tags=["impact"])
api_router.include_router(social.router, prefix="/social", tags=["social"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(trending.router, prefix="/trending", tags=["trending"])
