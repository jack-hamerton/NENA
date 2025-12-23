
from pydantic import BaseModel

class CommunityRoomBase(BaseModel):
    name: str
    description: str

class CommunityRoomCreate(CommunityRoomBase):
    pass

class CommunityRoomUpdate(CommunityRoomBase):
    pass

class CommunityRoomInDBBase(CommunityRoomBase):
    id: int
    class Config:
        orm_mode = True

class CommunityRoom(CommunityRoomInDBBase):
    pass
