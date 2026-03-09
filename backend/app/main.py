
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints import (
    notifications as notifications_router,
    podcasts as podcasts_router,
    chat as chat_router
)
from app.reminders import start_scheduler
from app.db.session import engine
from app.db.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

app.mount("/static", StaticFiles(directory="static"), name="static")

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Include the existing routers
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router.router, prefix="/notifications", tags=["notifications"])
app.include_router(podcasts_router.router, prefix="/api/podcasts", tags=["podcasts"])

# Include the new Chat router
app.include_router(chat_router.router, tags=["chat"])
