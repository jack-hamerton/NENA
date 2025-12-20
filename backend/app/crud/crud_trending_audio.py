from app.crud.base import CRUDBase
from app.models.trending_audio import TrendingAudio
from app.schemas.trending_audio import TrendingAudioCreate, TrendingAudioUpdate

class CRUDTrendingAudio(CRUDBase[TrendingAudio, TrendingAudioCreate, TrendingAudioUpdate]):
    pass

trending_audio = CRUDTrendingAudio(TrendingAudio)
