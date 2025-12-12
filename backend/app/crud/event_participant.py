from app.crud.base import CRUDBase
from app.models.event_participant import EventParticipant
from app.schemas.event_participant import EventParticipantCreate, EventParticipantUpdate


class CRUDEventParticipant(CRUDBase[EventParticipant, EventParticipantCreate, EventParticipantUpdate]):
    pass


event_participant = CRUDEventParticipant(EventParticipant)
