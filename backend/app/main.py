
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router
from app.ai.services import ai_service

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

# Create a new router for AI-specific endpoints
ai_router = APIRouter()

@ai_router.post("/self-learn", status_code=200)
def run_ai_learning_cycle():
    """
    Triggers a full self-improvement cycle for the AI.

    The AI will:
    1.  Generate a coding challenge for itself.
    2.  Attempt to write a solution.
    3.  Evaluate its own solution for correctness (AI Judge).
    4.  Update its internal parameters based on the outcome.
    """
    feedback = ai_service.run_self_improvement_cycle(domain="coding")
    return {"status": "AI self-improvement cycle completed.", "feedback": feedback}

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix="/ai")
