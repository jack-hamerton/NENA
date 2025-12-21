from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.ai.main import process_user_prompt, run_background_tasks

router = APIRouter()


class AIRequest(BaseModel):
    prompt: str


@router.post("/conversation")
def conversation(request: AIRequest):
    """
    Handles a user's conversation with the AI assistant.
    """
    # Process the prompt using the new AI service entry point
    return process_user_prompt(request.prompt)


@router.post("/background-task")
def trigger_background_task(background_tasks: BackgroundTasks):
    """
    Triggers the AI's self-improvement cycle as a background task.
    """
    # Add the self-improvement cycle to the background tasks
    background_tasks.add_task(run_background_tasks)
    return {"message": "AI self-improvement cycle started in the background."}
