from pydantic import BaseModel
from typing import Any, Dict

class Notification(BaseModel):
    type: str
    payload: Dict[str, Any]
