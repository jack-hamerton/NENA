
from fastapi import APIRouter, Body
from backend.app.ai.services import ai_service
from backend.app.ai import schemas

router = APIRouter()


@router.post("/ai/generate_response", response_model=schemas.AIResponse)
def generate_response(prompt: schemas.AIPrompt = Body(...)):
    response = ai_service.generate_response(prompt.prompt)
    return {"response": response}


@router.post("/ai/generate_content", response_model=schemas.AIResponse)
def generate_content(prompt: schemas.AIPrompt = Body(...)):
    response = ai_service.generate_content(prompt.prompt)
    return {"response": response}


@router.post("/ai/summarize_text", response_model=schemas.AIResponse)
def summarize_text(text: schemas.AIText = Body(...)):
    response = ai_service.summarize_text(text.text)
    return {"response": response}


@router.post("/ai/assist_with_code", response_model=schemas.AIResponse)
def assist_with_code(code: schemas.AICode = Body(...)):
    response = ai_service.assist_with_code(code.code, code.language)
    return {"response": response}
