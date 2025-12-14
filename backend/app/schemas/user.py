
from pydantic import BaseModel, EmailStr
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    phone_number: str | None = None
    country_code: str | None = None
    profile_photo_privacy: str = "everyone"
    about_privacy: str = "everyone"
    online_status_privacy: str = "everyone"
    pin_enabled: bool = False
    silence_unknown_callers: bool = False

# Properties to receive on user creation
class UserCreate(UserBase):
    password: str
    hashed_pin: Optional[str] = None

# Properties to receive on user update
class UserUpdate(UserBase):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    country_code: Optional[str] = None
    profile_photo_privacy: Optional[str] = None
    about_privacy: Optional[str] = None
    online_status_privacy: Optional[str] = None
    pin_enabled: Optional[bool] = None
    hashed_pin: Optional[str] = None
    silence_unknown_callers: Optional[bool] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    class Config:
        from_attributes = True

# Properties to return to client
class User(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
