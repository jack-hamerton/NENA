from app.models.poll_vote import PollVote
from app.schemas.poll_vote import PollVoteCreate, PollVoteUpdate
from .base import CRUDBase

class CRUDPollVote(CRUDBase[PollVote, PollVoteCreate, PollVoteUpdate]):
    pass

poll_vote = CRUDPollVote(PollVote)
