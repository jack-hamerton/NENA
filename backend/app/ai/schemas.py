from pydantic import BaseModel

class AIChat(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    response: str

class AIPrompt(BaseModel):
    prompt: str
