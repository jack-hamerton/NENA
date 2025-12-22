from app.models.poll import Poll, PollOption, PollVote
from app.schemas.poll import PollCreate, PollUpdate, PollVoteCreate
from .base import CRUDBase
from sqlalchemy.orm import Session
from typing import List, Dict

class CRUDPoll(CRUDBase[Poll, PollCreate, PollUpdate]):
    def create(self, db: Session, *, obj_in: PollCreate) -> Poll:
        db_obj = Poll(
            question=obj_in.question,
            duration=obj_in.duration,
            anonymous=obj_in.anonymous,
            room_id=obj_in.room_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        for option_in in obj_in.options:
            option = PollOption(text=option_in.text, poll_id=db_obj.id)
            db.add(option)
            db.commit()
            db.refresh(option)

        return db_obj

    def get_multi_by_room(self, db: Session, *, room_id: int, skip: int = 0, limit: int = 100) -> List[Poll]:
        return db.query(self.model).filter(Poll.room_id == room_id).offset(skip).limit(limit).all()

    def get_results(self, db: Session, *, poll_id: int) -> Dict[str, float]:
        poll = self.get(db, id=poll_id)
        total_votes = 0
        results = {}

        for option in poll.options:
            total_votes += option.votes

        if total_votes == 0:
            for option in poll.options:
                results[option.text] = 0.0
        else:
            for option in poll.options:
                results[option.text] = (option.votes / total_votes) * 100

        return results

class CRUDPollVote(CRUDBase[PollVote, PollVoteCreate, None]):
    def create(self, db: Session, *, obj_in: PollVoteCreate) -> PollVote:
        db_obj = PollVote(
            poll_id=obj_in.poll_id,
            option_id=obj_in.option_id,
            # user_id=obj_in.user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

poll = CRUDPoll(Poll)
poll_vote = CRUDPollVote(PollVote)
