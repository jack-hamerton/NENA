
from pydantic import BaseModel
from typing import Optional
import datetime

# Schema for creating a new document
class DocumentCreate(BaseModel):
    document_id: str
    content: Optional[str] = ''

# Schema for reading a document, includes fields from the database model
class DocumentRead(BaseModel):
    id: int
    document_id: str
    content: str
    created_at: datetime.datetime
    last_accessed: datetime.datetime

    class Config:
        orm_mode = True
