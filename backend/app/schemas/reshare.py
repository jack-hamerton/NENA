from pydantic import BaseModel
import uuid

class ReshareBase(BaseModel):
    post_id: uuid.UUID

class ReshareCreate(ReshareBase):
    pass

class Reshare(ReshareBase):
    id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        orm_mode = True
