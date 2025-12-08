from sqlalchemy.orm import Session
from app.crud.user import user
from app.schemas.user import UserCreate
from app.tests.utils.utils import random_email, random_lower_string

def create_random_user(db: Session):
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    return user.create(db, obj_in=user_in)
