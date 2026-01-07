
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from app import get_db
from app.ai.services.ai_service import assist_user
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.schemas.ai import AIRequest, AIResponse
from app.ai.services.ai_knowledge_base import run_self_improvement_cycle

router = APIRouter()

@router.post("/assist", response_model=AIResponse)
def post_assistance(request: AIRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Endpoint for receiving user prompts and returning AI assistance.
    """
    response = assist_user(db, request.prompt, current_user.id, request.context)
    return AIResponse(response=response)

@router.on_event("startup")
def startup_event():
    """
    On startup, we can trigger any initial AI model loading or background tasks.
    Here, we start the AI's self-improvement cycles.
    """
    # In a real-world application, you would run this in a separate process
    # so as not to block the main application startup.
    run_background_tasks()

def run_background_tasks():
    """
    This function is the main entry point for the AI's internal self-improvement tasks.
    It kicks off self-improvement cycles for various AI task domains.
    """
    # Run a self-improvement cycle for the AI on advocacy tasks
    run_self_improvement_cycle(domain="advocacy_tasks")
    
    # Run a self-improvement cycle for the AI on data analysis tasks
    run_self_improvement_cycle(domain="data_analysis_tasks")
