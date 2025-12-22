from app.models.feed_poll import FeedPoll, FeedPollOption, FeedPollVote
from app.schemas.feed_poll import FeedPollCreate, FeedPollVoteCreate
from .base import CRUDBase
from sqlalchemy.orm import Session
from typing import List, Dict

class CRUDFeedPoll(CRUDBase[FeedPoll, FeedPollCreate, None]):
    def create(self, db: Session, *, obj_in: FeedPollCreate) -> FeedPoll:
        db_obj = FeedPoll(
            question=obj_in.question,
            duration=obj_in.duration,
            anonymous=obj_in.anonymous,
            user_id=obj_in.user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        for option_in in obj_in.options:
            option = FeedPollOption(text=option_in.text, feed_poll_id=db_obj.id)
            db.add(option)
            db.commit()
            db.refresh(option)

        return db_obj

    def get_multi_by_user(self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100) -> List[FeedPoll]:
        return db.query(self.model).filter(FeedPoll.user_id == user_id).offset(skip).limit(limit).all()

    def get_results(self, db: Session, *, feed_poll_id: int) -> Dict[str, float]:
        poll = self.get(db, id=feed_poll_id)
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

class CRUDFeedPollVote(CRUDBase[FeedPollVote, FeedPollVoteCreate, None]):
    def create(self, db: Session, *, obj_in: FeedPollVoteCreate) -> FeedPollVote:
        db_obj = FeedPollVote(
            feed_poll_id=obj_in.feed_poll_id,
            option_id=obj_in.option_id,
            user_id=obj_in.user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

feed_poll = CRUDFeedPoll(FeedPoll)
feed_poll_vote = CRUDFeedPollVote(FeedPollVote)
