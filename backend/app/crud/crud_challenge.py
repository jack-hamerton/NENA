from app.crud.base import CRUDBase
from app.models.challenge import Challenge
from app.schemas.challenge import ChallengeCreate, ChallengeUpdate

class CRUDChallenge(CRUDBase[Challenge, ChallengeCreate, ChallengeUpdate]):
    pass

challenge = CRUDChallenge(Challenge)
