from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.ai.schemas import AIPrompt, AIResponse
from .ai_handlers import (
    handle_prompt,
    handle_chat,
    handle_summarize,
    handle_suggest_next_steps,
)
from app.core.dependencies import get_current_user
from app.db.session import get_db

router = APIRouter()

@router.post("/prompt", response_model=AIResponse)
def prompt_handler(prompt: AIPrompt, user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return handle_prompt(db, prompt, user_id)

@router.post("/chat", response_model=AIResponse)
def chat_handler(prompt: AIPrompt, user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return handle_chat(db, prompt, user_id)

@router.post("/summarize", response_model=AIResponse)
def summarize_handler(text: str, user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return handle_summarize(db, text, user_id)

@router.post("/suggest_next_steps", response_model=AIResponse)
def suggest_next_steps_handler(
    text: str, user_id: str = Depends(get_current_user), db: Session = Depends(get_db)
):
    return handle_suggest_next_steps(db, text, user_id)
