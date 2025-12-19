from pydantic import BaseModel, UUID4


class ProfileBase(BaseModel):
    bio: str | None = None
    profile_picture_url: str | None = None


class ProfileCreate(ProfileBase):
    user_id: UUID4


class ProfileUpdate(ProfileBase):
    pass


class Profile(ProfileBase):
    id: UUID4
    user_id: UUID4

    class Config:
        orm_mode = True
