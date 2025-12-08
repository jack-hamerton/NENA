from sqlalchemy.orm import Session
from app.crud.poll_vote import poll_vote
from app.schemas.poll_vote import PollVoteCreate
from app.tests.utils.utils import random_lower_string
from app.tests.utils.user import create_random_user
from app.crud.poll import poll
from app.schemas.poll import PollCreate

def test_create_poll_vote(db: Session) -> None:
    user = create_random_user(db)
    question = random_lower_string()
    options = [random_lower_string() for _ in range(3)]
    duration_minutes = 30
    poll_in = PollCreate(question=question, options=options, duration_minutes=duration_minutes)
    created_poll = poll.create(db, obj_in=poll_in)
    option_to_vote = options[0]
    vote_in = PollVoteCreate(poll_id=created_poll.id, option=option_to_vote, user_id=user.id)
    created_vote = poll_vote.create(db, obj_in=vote_in)
    assert created_vote.poll_id == created_poll.id
    assert created_vote.option == option_to_vote
    assert created_vote.user_id == user.id
