
from pydantic import BaseModel

class RoomMessageBase(BaseModel):
    message: str

class RoomMessageCreate(RoomMessageBase):
    room_id: int

class RoomMessageUpdate(RoomMessageBase):
    pass

class RoomMessageInDBBase(RoomMessageBase):
    id: int
    user_id: int
    room_id: int
    class Config:
        orm_mode = True

class RoomMessage(RoomMessageInDBBase):
    pass
