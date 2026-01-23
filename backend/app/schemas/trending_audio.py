from pydantic import BaseModel
import uuid

class TrendingAudioBase(BaseModel):
    title: str
    artist: str | None = None
    url: str

class TrendingAudioCreate(TrendingAudioBase):
    pass

class TrendingAudioUpdate(TrendingAudioBase):
    pass

class TrendingAudio(TrendingAudioBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
