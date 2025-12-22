from pydantic import BaseModel
from typing import List, Optional

class Podcast(BaseModel):
    id: int
    title: str
    description: str
    creator_id: int

    class Config:
        orm_mode = True

class User(BaseModel):
    id: int
    username: str
    email: str
    podcasts: List[Podcast] = []

    class Config:
        orm_mode = True

class Message(BaseModel):
    id: int
    content: str
    conversation_id: int
    sender_id: int

    class Config:
        orm_mode = True

class Conversation(BaseModel):
    id: int
    messages: List[Message] = []
    participants: List[User] = []

    class Config:
        orm_mode = True

class ConversationCreate(BaseModel):
    participant_ids: List[int]

class Room(BaseModel):
    id: int
    name: str
    creator_id: int
    participants: List[User] = []

    class Config:
        orm_mode = True

class RoomCreate(BaseModel):
    name: str

class RoomUpdate(BaseModel):
    name: Optional[str] = None

class Vote(BaseModel):
    user_id: int
    poll_option_id: int

    class Config:
        orm_mode = True

class PollOption(BaseModel):
    id: int
    text: str
    votes: List[User] = []

    class Config:
        orm_mode = True

class Poll(BaseModel):
    id: int
    question: str
    options: List[PollOption] = []

    class Config:
        orm_mode = True

class PollCreate(BaseModel):
    question: str
    options: List[str]

class VoteCreate(BaseModel):
    poll_option_id: int
