
from typing import Any, Dict, Optional, Union, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.models.follower import Follower
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        create_data = {
            'username': obj_in.username,
            'first_name': obj_in.first_name,
            'last_name': obj_in.last_name,
            'email': obj_in.email,
            'hashed_password': get_password_hash(obj_in.password),
        }
        db_obj = User(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(
        self, db: Session, *, username: str, password: str
    ) -> Optional[User]:
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)
    
    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser

    def search(self, db: Session, *, query: str, limit: int = 10) -> List[User]:
        return db.query(User).filter(
            User.username.ilike(f"%{query}%") | User.first_name.ilike(f"%{query}%") | User.last_name.ilike(f"%{query}%")
        ).limit(limit).all()

    def get_follower_intent_metrics(self, db: Session, *, user_id: int) -> Dict[str, int]:
        results = db.query(Follower.intent, func.count(Follower.intent)).filter(Follower.followed_id == user_id).group_by(Follower.intent).all()
        metrics = {
            "supporters": 0,
            "amplifiers": 0,
            "learners": 0,
            "mentors": 0
        }
        for intent, count in results:
            if intent == 'supporter':
                metrics['supporters'] = count
            elif intent == 'amplifier':
                metrics['amplifiers'] = count
            elif intent == 'learner':
                metrics['learners'] = count
            elif intent == 'mentor':
                metrics['mentors'] = count
        return metrics

    def get_followers_of_followers(self, db: Session, *, user: User) -> List[List[User]]:
        followers_of_followers = []
        for follower in user.followers:
            followers_of_followers.append(follower.followers)
        return followers_of_followers

user = CRUDUser(User)
