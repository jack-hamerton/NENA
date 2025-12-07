from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import auth, profiles, discover, collaboration, messages, comments, rooms, study, analytics, health, music_podcast_routes

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

app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(profiles.router, prefix=settings.API_V1_STR, tags=["profiles"])
app.include_router(discover.router, prefix=settings.API_V1_STR, tags=["discover"])
app.include_router(collaboration.router, prefix=settings.API_V1_STR, tags=["collaboration"])
app.include_router(messages.router, prefix=settings.API_V1_STR, tags=["messages"])
app.include_router(comments.router, prefix=settings.API_V1_STR, tags=["comments"])
app.include_router(rooms.router, prefix=settings.API_V1_STR, tags=["rooms"])
app.include_router(study.router, prefix=settings.API_V1_STR, tags=["study"])
app.include_router(analytics.router, prefix=settings.API_V1_STR, tags=["analytics"])
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(music_podcast_routes.router, prefix=settings.API_V1_STR, tags=["music_podcast"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Nena API"}
