
from pydantic import BaseModel
import uuid

class CommunityRoomBase(BaseModel):
    name: str
    description: str

class CommunityRoomCreate(CommunityRoomBase):
    pass

class CommunityRoomUpdate(CommunityRoomBase):
    pass

class CommunityRoomInDBBase(CommunityRoomBase):
    id: uuid.UUID
    class Config:
        from_attributes = True

class CommunityRoom(CommunityRoomInDBBase):
    pass
