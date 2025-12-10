
from sqlalchemy.orm import Session
from app.models.impact import Challenge, Mitigation
from app.models.user import User

def calculate_impact_score(db: Session, user: User) -> float:
    """
    Calculates the work impact score for a user.

    This is a simple first implementation. It calculates the score as the ratio of
    mitigations to challenges created by the user. A higher ratio indicates a
    greater impact.

    A more advanced implementation could use NLP to analyze the content of the
    challenges and mitigations.
    """
    num_challenges = db.query(Challenge).filter(Challenge.creator_id == user.id).count()
    num_mitigations = db.query(Mitigation).filter(Mitigation.creator_id == user.id).count()

    if num_challenges == 0:
        return 0.0

    return num_mitigations / num_challenges
