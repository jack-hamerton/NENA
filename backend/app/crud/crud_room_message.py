
from app.crud.base import CRUDBase
from app.models.community_room import RoomMessage
from app.schemas.room_message import RoomMessageCreate, RoomMessageUpdate

class CRUDRoomMessage(CRUDBase[RoomMessage, RoomMessageCreate, RoomMessageUpdate]):
    pass

room_message = CRUDRoomMessage(RoomMessage)
