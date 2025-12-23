
from sqlalchemy.orm import Session, joinedload
from app import models, schemas

def get_poll(db: Session, poll_id: int):
    return db.query(models.Poll).options(joinedload(models.Poll.options)).filter(models.Poll.id == poll_id).first()

def create_poll(db: Session, poll: schemas.PollCreate, episode_id: int):
    db_poll = models.Poll(question=poll.question, episode_id=episode_id)
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)
    for option_in in poll.options:
        db_option = models.PollOption(text=option_in.text, poll_id=db_poll.id)
        db.add(db_option)
        db.commit()
        db.refresh(db_option)
    return db_poll

def vote_poll(db: Session, poll_id: int, option_id: int, user_id: int):
    # Check if the user has already voted
    existing_vote = (
        db.query(models.PollVote)
        .filter(
            models.PollVote.poll_id == poll_id,
            models.PollVote.user_id == user_id
        )
        .first()
    )
    if existing_vote:
        # User has already voted, so we update the vote
        existing_vote.option_id = option_id
        db.commit()
        db.refresh(existing_vote)
        return existing_vote

    # User has not voted, so we create a new vote
    db_vote = models.PollVote(
        poll_id=poll_id, option_id=option_id, user_id=user_id
    )
    db.add(db_vote)
    db.commit()
    db.refresh(db_vote)
    return db_vote

def get_poll_results(db: Session, poll_id: int):
    poll = get_poll(db, poll_id)
    if not poll:
        return None

    results = {option.text: 0 for option in poll.options}
    votes = db.query(models.PollVote).filter(models.PollVote.poll_id == poll_id).all()

    for vote in votes:
        for option in poll.options:
            if option.id == vote.option_id:
                results[option.text] += 1
                break
    return results
