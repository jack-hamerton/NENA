
from pydantic import BaseModel
import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    created_at: datetime.datetime
    author_id: int
    room_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    messages: list[Message] = []

    class Config:
        orm_mode = True

class RoomBase(BaseModel):
    name: str

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    messages: list[Message] = []

    class Config:
        orm_mode = True
