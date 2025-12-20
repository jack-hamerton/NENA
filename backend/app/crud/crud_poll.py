from app.crud.base import CRUDBase
from app.models.poll import Poll, PollOption
from app.schemas.poll import PollCreate, PollUpdate, PollOptionCreate, PollOptionUpdate

class CRUDPoll(CRUDBase[Poll, PollCreate, PollUpdate]):
    def create_with_options(self, db, *, obj_in: PollCreate, post_id: uuid.UUID):
        poll = super().create(db, obj_in=PollCreate(), post_id=post_id)
        for option_in in obj_in.options:
            poll_option = PollOption(**option_in.dict(), poll_id=poll.id)
            db.add(poll_option)
        db.commit()
        db.refresh(poll)
        return poll


class CRUDPollOption(CRUDBase[PollOption, PollOptionCreate, PollOptionUpdate]):
    pass

poll = CRUDPoll(Poll)
poll_option = CRUDPollOption(PollOption)
