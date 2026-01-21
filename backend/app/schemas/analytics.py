
from pydantic import BaseModel
from typing import List

class AdvocacyImpactMatrix(BaseModel):
    matrix: List[List[int]]
    recommendation: str
