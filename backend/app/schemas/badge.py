
from typing import Optional
from pydantic import BaseModel
import uuid

class BadgeBase(BaseModel):
    name: str
    description: str
    icon_url: str


class BadgeCreate(BadgeBase):
    pass


class BadgeUpdate(BadgeBase):
    pass


class Badge(BadgeBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class UserBadgeBase(BaseModel):
    user_id: uuid.UUID
    badge_id: uuid.UUID


class UserBadgeCreate(UserBadgeBase):
    pass


class UserBadge(UserBadgeBase):
    id: uuid.UUID
    awarded_at: str

    class Config:
        from_attributes = True
