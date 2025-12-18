from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import create_access_token
from app.schemas.user import UserCreate, UserLogin
from app.crud import user as crud_user

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user_by_username = crud_user.get_by_username(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    if user.email:
        db_user_by_email = crud_user.get_by_email(db, email=user.email)
        if db_user_by_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    crud_user.create(db=db, obj_in=user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = crud_user.authenticate(db, username=user.username, password=user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}