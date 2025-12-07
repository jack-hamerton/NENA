
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.routes import deps
from app.services import pnv_service

router = APIRouter()

@router.post("/send-pnv")
def send_pnv(
    *, 
    db: Session = Depends(deps.get_db), 
    pnv_in: schemas.PNVRequest
) -> dict:
    """
    Send a PNV request to the user.
    """
    verification_id = pnv_service.send_pnv_request(
        phone_number=pnv_in.phone_number, country_code=pnv_in.country_code
    )
    return {"verification_id": verification_id}

@router.post("/check-pnv")
def check_pnv(
    *, 
    db: Session = Depends(deps.get_db), 
    pnv_in: schemas.PNVCheck
) -> dict:
    """
    Check a PNV code from the user.
    """
    is_valid = pnv_service.check_pnv_request(
        verification_id=pnv_in.verification_id, code=pnv_in.code
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    return {"message": "PNV successful"}
