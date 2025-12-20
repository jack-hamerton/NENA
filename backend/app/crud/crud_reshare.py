from app.crud.base import CRUDBase
from app.models.reshare import Reshare
from app.schemas.reshare import ReshareCreate, ReshareUpdate

class CRUDReshare(CRUDBase[Reshare, ReshareCreate, ReshareUpdate]):
    pass

reshare = CRUDReshare(Reshare)
