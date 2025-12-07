
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import (auth, profiles, discover, collaboration, messages, 
                    comments, rooms, study, analytics, health, music_podcast_routes, pnv)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, tags=["auth"], prefix=settings.API_V1_STR)
app.include_router(profiles.router, tags=["profiles"], prefix=settings.API_V1_STR)
app.include_router(discover.router, tags=["discover"], prefix=settings.API_V1_STR)
app.include_router(collaboration.router, tags=["collaboration"], prefix=settings.API_V1_STR)
app.include_router(messages.router, tags=["messages"], prefix=settings.API_V1_STR)
app.include_router(comments.router, tags=["comments"], prefix=settings.API_V1_STR)
app.include_router(rooms.router, tags=["rooms"], prefix=settings.API_V1_STR)
app.include_router(study.router, tags=["study"], prefix=settings.API_V1_STR)
app.include_router(analytics.router, tags=["analytics"], prefix=settings.API_V1_STR)
app.include_router(health.router, tags=["health"], prefix=settings.API_V1_STR)
app.include_router(music_podcast_routes.router, tags=["music_and_podcast"], prefix=settings.API_V1_STR)
app.include_router(pnv.router, tags=["pnv"], prefix=settings.API_V1_STR)
