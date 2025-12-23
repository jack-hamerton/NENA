
from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.badge import Badge, UserBadge
from app.schemas.badge import BadgeCreate, BadgeUpdate


class CRUDBadge(CRUDBase[Badge, BadgeCreate, BadgeUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Badge]:
        return db.query(Badge).filter(Badge.name == name).first()

    def get_user_badges(self, db: Session, *, user_id: str) -> List[UserBadge]:
        return db.query(UserBadge).filter(UserBadge.user_id == user_id).all()

    def award_badge(self, db: Session, *, user_id: str, badge_id: str) -> UserBadge:
        user_badge = UserBadge(user_id=user_id, badge_id=badge_id)
        db.add(user_badge)
        db.commit()
        db.refresh(user_badge)
        return user_badge

badge = CRUDBadge(Badge)
