
import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import create_access_token, create_password_reset_token, verify_password_reset_token
from app.schemas.user import UserCreate, UserLogin, UserUpdate
from app.crud import user as crud_user
from app.services.email_service import send_password_reset_email

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Handles user registration, ensuring data is valid and secure."""
    db_user_by_username = crud_user.get_by_username(db, username=user.username)
    if db_user_by_username:
        user.username = f"{user.username}{''.join(random.choices(string.digits, k=4))}"

    if user.email:
        db_user_by_email = crud_user.get_by_email(db, email=user.email)
        if db_user_by_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    db_user = crud_user.create(db=db, obj_in=user)
    access_token = create_access_token(subject=db_user.id)

# access_token = create_access_token(data={"sub": db_user.username, "email": db_user.email})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": db_user.username,
            "email": db_user.email
        }
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticates a user and returns an access token."""
    db_user = crud_user.authenticate(db, username=user.username, password=user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    # access_token = create_access_token(data={"sub": db_user.username, "email": db_user.email})
    access_token = create_access_token(subject=db_user.id)

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": db_user.username,
            "email": db_user.email
        }
    }

@router.post("/forgot-password")
def forgot_password(email: str, db: Session = Depends(get_db)):
    """Initiates the password reset process."""
    user = crud_user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = create_password_reset_token(email=email)
    send_password_reset_email(
        email_to=user.email,
        username=user.username,
        token=password_reset_token
    )
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """Resets the user's password."""
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud_user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    crud_user.update(db, db_obj=user, obj_in=UserUpdate(password=new_password))
    return {"message": "Password updated successfully"}

