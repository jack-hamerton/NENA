
from pydantic import BaseModel
import datetime
from typing import List
from models.chat import UserRole, RoomRole

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    user_id: int
    room_id: int

class Message(MessageBase):
    id: int
    timestamp: datetime.datetime
    user: 'User'

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: UserRole
    messages: List[Message] = []

    class Config:
        orm_mode = True

class RoomMembershipSchema(BaseModel):
    role: RoomRole
    user: User

    class Config:
        orm_mode = True

class RoomBase(BaseModel):
    name: str

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int
    messages: List[Message] = []
    member_associations: List['RoomMembershipSchema'] = []

    class Config:
        orm_mode = True

class PostBase(BaseModel):
    content: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    created_at: datetime.datetime
    author: User

    class Config:
        orm_mode = True

# To handle circular dependencies
User.update_forward_refs()
Room.update_forward_refs()
Message.update_forward_refs()
RoomMembershipSchema.update_forward_refs()
Post.update_forward_refs()
