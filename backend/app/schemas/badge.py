
from typing import Optional
from pydantic import BaseModel


class BadgeBase(BaseModel):
    name: str
    description: str
    icon_url: str


class BadgeCreate(BadgeBase):
    pass


class BadgeUpdate(BadgeBase):
    pass


class Badge(BadgeBase):
    id: str

    class Config:
        orm_mode = True


class UserBadgeBase(BaseModel):
    user_id: str
    badge_id: str


class UserBadgeCreate(UserBadgeBase):
    pass


class UserBadge(UserBadgeBase):
    id: str
    awarded_at: str

    class Config:
        orm_mode = True
