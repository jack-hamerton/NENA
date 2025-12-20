from pydantic import BaseModel
import uuid

class QuotePostBase(BaseModel):
    post_id: uuid.UUID
    comment: str

class QuotePostCreate(QuotePostBase):
    pass

class QuotePost(QuotePostBase):
    id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        orm_mode = True
