
from fastapi import Depends
from sqlalchemy.orm import Session
from app.ai.services.ai_service import (
    chat_with_ai as service_chat_with_ai,
    summarize as service_summarize,
    suggest_next_steps as service_suggest_next_steps,
)
from app.ai.services.ai_knowledge_base import run_self_improvement_cycle

def chat_with_ai(db: Session, prompt: str, user_id: int):
    """
    This function handles direct chat with the AI.
    """
    return service_chat_with_ai(db, prompt, user_id)

def summarize(db: Session, text: str, user_id: int, context: dict = None):
    """
    This function summarizes a given text.
    """
    return service_summarize(db, text, user_id, context)

def suggest_next_steps(db: Session, text: str, user_id: int, context: dict = None):
    """
    This function suggests next steps based on a given text.
    """
    return service_suggest_next_steps(db, text, user_id, context)

def run_background_tasks():
    """
    This function is the main entry point for the AI's internal self-improvement tasks.
    It kicks off self-improvement cycles for various AI task domains.
    """
    # Run a self-improvement cycle for the AI on advocacy tasks
    run_self_improvement_cycle(domain="advocacy_tasks")
    
    # Run a self-improvement cycle for the AI on study analysis tasks
    run_self_improvement_cycle(domain="study_tasks")
