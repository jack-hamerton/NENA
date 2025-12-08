from sqlalchemy.orm import Session
from app.crud.poll import poll
from app.schemas.poll import PollCreate, PollUpdate
from app.tests.utils.utils import random_lower_string

def test_create_poll(db: Session) -> None:
    question = random_lower_string()
    options = [random_lower_string() for _ in range(3)]
    duration_minutes = 30
    poll_in = PollCreate(question=question, options=options, duration_minutes=duration_minutes)
    created_poll = poll.create(db, obj_in=poll_in)
    assert created_poll.question == question
    assert created_poll.options == options
    assert created_poll.duration_minutes == duration_minutes

def test_get_poll(db: Session) -> None:
    question = random_lower_string()
    options = [random_lower_string() for _ in range(3)]
    duration_minutes = 30
    poll_in = PollCreate(question=question, options=options, duration_minutes=duration_minutes)
    created_poll = poll.create(db, obj_in=poll_in)
    stored_poll = poll.get(db, id=created_poll.id)
    assert stored_poll
    assert stored_poll.question == question
    assert stored_poll.options == options
    assert stored_poll.duration_minutes == duration_minutes

def test_update_poll(db: Session) -> None:
    question = random_lower_string()
    options = [random_lower_string() for _ in range(3)]
    duration_minutes = 30
    poll_in = PollCreate(question=question, options=options, duration_minutes=duration_minutes)
    created_poll = poll.create(db, obj_in=poll_in)
    new_question = random_lower_string()
    poll_update = PollUpdate(question=new_question, options=options, duration_minutes=duration_minutes)
    updated_poll = poll.update(db, db_obj=created_poll, obj_in=poll_update)
    assert updated_poll.question == new_question
    assert updated_poll.options == options
    assert updated_poll.duration_minutes == duration_minutes

def test_delete_poll(db: Session) -> None:
    question = random_lower_string()
    options = [random_lower_string() for _ in range(3)]
    duration_minutes = 30
    poll_in = PollCreate(question=question, options=options, duration_minutes=duration_minutes)
    created_poll = poll.create(db, obj_in=poll_in)
    deleted_poll = poll.remove(db, id=created_poll.id)
    retrieved_poll = poll.get(db, id=created_poll.id)
    assert retrieved_poll is None
    assert deleted_poll.id == created_poll.id
