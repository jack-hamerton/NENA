import re
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

# Shared properties
class UserBase(BaseModel):
    username: str
    email: EmailStr | None = None

# Properties to receive on user creation
class UserCreate(UserBase):
    first_name: str | None = None
    last_name: str | None = None
    password: str
    isGoogleAuth: bool = False

    @field_validator('password')
    def password_complexity(cls, v, info):
        # Skip validation if Google Auth
        if info.data.get('isGoogleAuth'):
            return v
            
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
    password: Optional[str] = None
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
    id: UUID
    is_active: bool

    class Config:
        from_attributes = True
