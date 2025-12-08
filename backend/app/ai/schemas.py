
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AIResponse(BaseModel):
    response: str

class ConversationRequest(BaseModel):
    prompt: str
    conversation_history: Optional[List[Dict[str, str]]] = None

class ContentRequest(BaseModel):
    prompt: str
    mode: Optional[str] = "draft"

class SummarizeRequest(BaseModel):
    text: str

class CodeAssistRequest(BaseModel):
    code: str
    language: str
    task: Optional[str] = "explain"

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class ProblemSolvingRequest(BaseModel):
    problem: str

class WebBrowseRequest(BaseModel):
    query: str

class ImageAnalysisRequest(BaseModel):
    image_path: str
    prompt: str

class ImageGenerationRequest(BaseModel):
    prompt: str

class DataAnalysisRequest(BaseModel):
    file_path: str
    analysis_prompt: str

class AIAgentRequest(BaseModel):
    task_prompt: str

class CustomGPTRequest(BaseModel):
    prompt: str
    gpt_id: str

class MemoryUpdateRequest(BaseModel):
    conversation_data: Dict[str, Any]

class FeedbackRequest(BaseModel):
    feedback_data: Dict[str, Any]
