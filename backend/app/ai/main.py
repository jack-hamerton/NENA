from .services.ai_service import (
    assist_user,
    run_self_improvement_cycle,
)

def process_user_prompt(prompt: str):
    """
    This function is the main entry point for handling user-facing AI requests.
    It uses the 'assist_user' function from the AI service to get a response.
    """
    # Let the user assistant handle the prompt
    return assist_user(prompt)

def run_background_tasks():
    """
    This function is the main entry point for the AI's internal self-improvement tasks.
    It kicks off a self-improvement cycle for the coding domain.
    """
    # Run a self-improvement cycle for the AI programmer
    run_self_improvement_cycle(domain="coding")
