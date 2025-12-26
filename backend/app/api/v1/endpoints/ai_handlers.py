from sqlalchemy.orm import Session
from app.ai.schemas import AIPrompt, AIResponse
from app.ai.main import (
    process_user_prompt,
    chat_with_ai,
    summarize,
    suggest_next_steps,
)
from app.core.dependencies import get_current_user
from fastapi import Depends

def handle_prompt(db: Session, prompt: AIPrompt, user_id: str = Depends(get_current_user)):
    response = process_user_prompt(db, prompt.prompt, user_id)
    return {"response": response.get("response", "No response from AI.")}

def handle_chat(db: Session, prompt: AIPrompt, user_id: str = Depends(get_current_user)):
    response = chat_with_ai(db, prompt.prompt, user_id)
    return {"response": response.get("response", "No response from AI.")}

def handle_summarize(db: Session, text: str, user_id: str = Depends(get_current_user)):
    response = summarize(db, text, user_id)
    return {"response": response.get("response", "No response from AI.")}

def handle_suggest_next_steps(
    db: Session, text: str, user_id: str = Depends(get_current_user)
):
    response = suggest_next_steps(db, text, user_id)
    return {"response": response.get("response", "No response from AI.")}
