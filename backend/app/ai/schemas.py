from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AIChat(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
    rewritten_text: Optional[str] = None

class AIPrompt(BaseModel):
    prompt: str

class AIRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None

class ConversationRequest(BaseModel):
    prompt: str
    conversation_history: List[Dict[str, str]] = []

class ContentRequest(BaseModel):
    prompt: str
    mode: str  # "generate", "rewrite", "summarize"

class CodeAssistRequest(BaseModel):
    code: str
    language: str
    task: str  # "explain", "debug", "optimize", "generate"

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
    task: str
    parameters: Optional[Dict[str, Any]] = None
