from pydantic import BaseModel, Field
from typing import List, Optional


class ModerationResult(BaseModel):
    is_flagged: bool = Field(..., description="Whether the content was flagged as inappropriate.")
    details: str = Field(..., description="Details about the moderation result.")
    raw_output: List[dict] = Field(..., description="The raw output from the moderation model.")
