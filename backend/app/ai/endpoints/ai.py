
from fastapi import APIRouter, Body, UploadFile, File
from typing import Any, Dict
from backend.app.ai.services import ai_service
from backend.app.ai import schemas

router = APIRouter()

@router.post("/ai/conversation", response_model=schemas.AIResponse)
def conversation(request: schemas.ConversationRequest = Body(...)):
    """
    Endpoint for natural language conversation.
    """
    response = ai_service.generate_response(request.prompt, request.conversation_history)
    return {"response": response}

@router.post("/ai/generate_content", response_model=schemas.AIResponse)
def generate_content(request: schemas.ContentRequest = Body(...)):
    """
    Endpoint for content generation, rewriting, and summarization.
    """
    response = ai_service.generate_content(request.prompt, request.mode)
    return {"response": response}

@router.post("/ai/assist_with_code", response_model=schemas.AIResponse)
def assist_with_code(request: schemas.CodeAssistRequest = Body(...)):
    """
    Endpoint for code assistance (generation, explanation, debugging).
    """
    response = ai_service.assist_with_code(request.code, request.language, request.task)
    return {"response": response}

@router.post("/ai/translate", response_model=schemas.AIResponse)
def translate(request: schemas.TranslateRequest = Body(...)):
    """
    Endpoint for multilingual support.
    """
    response = ai_service.translate_text(request.text, request.target_language)
    return {"response": response}

@router.post("/ai/solve_problem", response_model=schemas.AIResponse)
def solve_problem(request: schemas.ProblemSolvingRequest = Body(...)):
    """
    Endpoint for reasoning and problem-solving.
    """
    response = ai_service.solve_problem(request.problem)
    return {"response": response}


# --- Advanced Tools & Modes ---

@router.post("/ai/web_browse", response_model=schemas.AIResponse)
def web_browse(request: schemas.WebBrowseRequest = Body(...)):
    """
    Endpoint for web browsing. (Paid feature)
    """
    response = ai_service.web_browse(request.query)
    return {"response": response}

@router.post("/ai/analyze_image", response_model=schemas.AIResponse)
def analyze_image(request: schemas.ImageAnalysisRequest = Body(...)):
    """
    Endpoint for image analysis. (Paid feature)
    """
    # In a real app, you might handle file uploads differently
    response = ai_service.analyze_image(request.image_path, request.prompt)
    return {"response": response}

@router.post("/ai/generate_image", response_model=schemas.AIResponse)
def generate_image(request: schemas.ImageGenerationRequest = Body(...)):
    """
    Endpoint for image generation. (Paid feature)
    """
    response = ai_service.generate_image(request.prompt)
    return {"response": response}

@router.post("/ai/analyze_data", response_model=schemas.AIResponse)
def analyze_data(request: schemas.DataAnalysisRequest = Body(...)):
    """
    Endpoint for data analysis. (Paid feature)
    """
    response = ai_service.analyze_data(request.file_path, request.analysis_prompt)
    return {"response": response}

@router.post("/ai/voice_conversation", response_model=schemas.AIResponse)
async def voice_conversation(audio: UploadFile = File(...)):
    """
    Endpoint for real-time voice conversations. (Paid feature)
    """
    # This is a simplified implementation. A real-world scenario would involve
    # streaming audio data and handling it appropriately.
    audio_bytes = await audio.read()
    response = ai_service.voice_conversation(audio_bytes)
    return {"response": response}

@router.post("/ai/run_agent", response_model=schemas.AIResponse)
def run_agent(request: schemas.AIAgentRequest = Body(...)):
    """
    Endpoint for running AI agents to perform multi-step tasks. (Paid feature)
    """
    response = ai_service.run_ai_agent(request.task_prompt)
    return {"response": response}

@router.post("/ai/custom_gpt", response_model=schemas.AIResponse)
def custom_gpt(request: schemas.CustomGPTRequest = Body(...)):
    """
    Endpoint for using custom GPTs. (Paid feature)
    """
    response = ai_service.custom_gpt(request.prompt, request.gpt_id)
    return {"response": response}


# --- Learning and Personalization ---

@router.post("/ai/update_memory")
def update_memory(request: schemas.MemoryUpdateRequest = Body(...)):
    """
    Endpoint for updating the AI's memory.
    """
    ai_service.update_memory(request.conversation_data)
    return {"status": "Memory updated"}

@router.post("/ai/feedback")
def feedback(request: schemas.FeedbackRequest = Body(...)):
    """
    Endpoint for the AI to learn from user feedback.
    """
    ai_service.adapt_to_user_needs(request.feedback_data)
    return {"status": "AI is adapting"}
