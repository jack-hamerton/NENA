
from app.crud.base import CRUDBase
from app.models.community_room import CommunityRoom
from app.schemas.community_room import CommunityRoomCreate, CommunityRoomUpdate

class CRUDCommunityRoom(CRUDBase[CommunityRoom, CommunityRoomCreate, CommunityRoomUpdate]):
    pass

community_room = CRUDCommunityRoom(CommunityRoom)
