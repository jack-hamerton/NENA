
from pydantic import BaseModel
from typing import List, Dict

class AnalysisResultCreate(BaseModel):
    sentiment: Dict
    themes: List[Dict]
    key_quotes: List[Dict]
