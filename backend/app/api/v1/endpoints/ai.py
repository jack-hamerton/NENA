from fastapi import APIRouter
from pydantic import BaseModel

# Import the new service
from app.services.moderation import ModerationService
from app.schemas.moderation import ModerationResult

router = APIRouter()
moderation_service = ModerationService()


class ConversationRequest(BaseModel):
    prompt: str


class ModerationRequest(BaseModel):
    text: str


@router.post("/conversation")
def conversation(request: ConversationRequest):
    """
    AI conversation endpoint.
    """
    # In a real application, you would integrate with a real AI service (e.g., OpenAI, Google AI).
    # For now, we'll just echo the prompt back.
    return {"response": f"You said: {request.prompt}"}


@router.post("/moderation/text", response_model=ModerationResult)
def moderate_text_endpoint(request: ModerationRequest):
    """
    Endpoint to moderate text content.
    """
    result = moderation_service.moderate_text(text=request.text)
    return result
