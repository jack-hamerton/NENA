
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.security import create_access_token
from app.db.session import get_db
from app.routes import deps
from app.services import pnv_service, email_service

router = APIRouter()

@router.post("/register/send-pnv")
def register_send_pnv(
    *, 
    db: Session = Depends(deps.get_db), 
    user_in: schemas.UserCreate
) -> dict:
    """
    Send a PNV request to the user during registration.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.user.get_by_phone_number(db, phone_number=user_in.phone_number)
    if user:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    pnv_service.send_pnv_request(
        phone_number=user_in.phone_number, country_code=user_in.country_code
    )
    return {"message": "PNV request sent"}

@router.post("/register/check-pnv", response_model=schemas.Token)
def register_check_pnv(
    *, 
    db: Session = Depends(deps.get_db), 
    pnv_in: schemas.PNVCheck, 
    user_in: schemas.UserCreate
) -> dict:
    """
    Check a PNV code from the user during registration and create the user.
    """
    is_valid = pnv_service.check_pnv_request(
        phone_number=pnv_in.phone_number, country_code=pnv_in.country_code, code=pnv_in.code
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    user = crud.user.create(db, obj_in=user_in)
    email_service.send_verification_email(email=user.email)
    
    return {
        "access_token": create_access_token(
            user.id
        ),
        "token_type": "bearer",
    }

@router.get("/verify-email")
def verify_email(
    *, 
    db: Session = Depends(deps.get_db),
    token: str,
    email: str
) -> dict:
    """
    Verify a user's email address from a token sent to their email.
    """
    is_valid = email_service.verify_email_token(email=email, token=token)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    user = crud.user.get_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    if user.is_email_verified:
        return {"message": "Email already verified"}

    crud.user.update(db, db_obj=user, obj_in=schemas.UserUpdate(is_email_verified=True))
    return {"message": "Email verified successfully"}


@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: schemas.UserCreate
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db,
        email=form_data.email,
        password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return {
        "access_token": create_access_token(
            user.id
        ),
        "token_type": "bearer",
    }
