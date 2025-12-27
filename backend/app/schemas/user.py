import re
from typing import Optional
from pydantic import BaseModel, EmailStr, validator

# Shared properties
class UserBase(BaseModel):
    username: str
    email: EmailStr | None = None

# Properties to receive on user creation
class UserCreate(UserBase):
    password: str

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
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain a special character')
        return v

# Properties for updating user settings
class UserUpdate(BaseModel):
    profile_photo_privacy: Optional[str] = None
    about_privacy: Optional[str] = None
    online_status_privacy: Optional[str] = None
    pin_enabled: Optional[bool] = None
    hashed_pin: Optional[str] = None
    silence_unknown_callers: Optional[bool] = None
    call_setting: Optional[str] = None

# Properties to receive on user login
class UserLogin(BaseModel):
    username: str
    password: str

# Properties to return to client
class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
