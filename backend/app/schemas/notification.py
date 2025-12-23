from pydantic import BaseModel

class NotificationBase(BaseModel):
    type: str
    payload: dict

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: int
    read: bool

    class Config:
        orm_mode = True
