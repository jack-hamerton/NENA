
from pydantic import BaseModel

class AIPrompt(BaseModel):
    prompt: str

class AIText(BaseModel):
    text: str

class AICode(BaseModel):
    code: str
    language: str

class AIResponse(BaseModel):
    response: str
