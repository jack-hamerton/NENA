from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
import re
from app.rooms.schemas.room import Room

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: str
    last_name: str
    profile_photo_privacy: str = "everyone"
    about_privacy: str = "everyone"
    online_status_privacy: str = "everyone"
    pin_enabled: bool = False
    silence_unknown_callers: bool = False

# Properties to receive on user creation
class UserCreate(UserBase):
    password: str
    username: str
    hashed_pin: Optional[str] = None

    @validator('password')
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain an uppercase letter')
        if not re.search(r"[a-z]", v):
            raise ValueError('Password must contain a lowercase letter')
        if not re.search(r"[0-9]", v):
            raise ValueError('Password must contain a number')
        return v

# Properties to receive on user login
class UserLogin(BaseModel):
    username: str
    password: str

# Properties to receive on user update
class UserUpdate(UserBase):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_photo_privacy: Optional[str] = None
    about_privacy: Optional[str] = None
    online_status_privacy: Optional[str] = None
    pin_enabled: Optional[bool] = None
    hashed_pin: Optional[str] = None
    silence_.unknown_callers: Optional[bool] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    username: str

    class Config:
        from_attributes = True

# Properties to return to client
class User(UserInDBBase):
    rooms: List[Room] = []
    name: str
    profile_picture_url: Optional[str] = None
    username: str

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
