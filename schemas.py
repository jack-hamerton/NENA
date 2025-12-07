
from pydantic import BaseModel
import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    user_id: int
    room_id: int

class Message(MessageBase):
    id: int
    timestamp: datetime.datetime
    user: 'User'
    room: 'Room'

    class Config:
        orm_mode = True

class RoomBase(BaseModel):
    name: str

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    messages: list[Message] = []
    members: list['User'] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    messages: list[Message] = []
    rooms: list[Room] = []


    class Config:
        orm_mode = True

# To handle circular dependencies
User.update_forward_refs()
Room.update_forward_refs()
Message.update_forward_refs()
