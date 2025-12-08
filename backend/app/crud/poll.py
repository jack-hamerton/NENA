from app.models.poll import Poll
from app.schemas.poll import PollCreate, PollUpdate
from .base import CRUDBase

class CRUDPoll(CRUDBase[Poll, PollCreate, PollUpdate]):
    pass

poll = CRUDPoll(Poll)
