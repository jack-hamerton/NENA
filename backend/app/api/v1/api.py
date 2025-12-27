from fastapi import APIRouter

from app.api.v1.endpoints import challenges, trending_audio, posts, users, utils, auth, search, studies, feed_polls, notifications, documents, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(challenges.router, prefix="/challenges", tags=["challenges"])
api_router.include_router(trending_audio.router, prefix="/trending-audio", tags=["trending-audio"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(studies.router, prefix="/studies", tags=["studies"])
api_router.include_router(feed_polls.router, prefix="/feed-polls", tags=["feed_polls"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
