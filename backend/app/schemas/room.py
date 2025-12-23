
from pydantic import BaseModel
from typing import List, Optional

class RoomBase(BaseModel):
    name: str

class RoomCreate(RoomBase):
    pass

class RoomUpdate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    creator_id: int
    participants: List['RoomParticipant'] = []

    class Config:
        orm_mode = True

class RoomParticipant(BaseModel):
    user_id: int

    class Config:
        orm_mode = True

Room.update_forward_refs()
