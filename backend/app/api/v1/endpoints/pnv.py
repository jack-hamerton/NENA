from fastapi import APIRouter
from pydantic import BaseModel

class PnvIn(BaseModel):
    phone_number: str
    country_code: str

class PnvCheckIn(BaseModel):
    pnv_in: PnvIn
    code: str

router = APIRouter()

@router.post("/register/send-pnv")
def send_pnv(pnv_in: PnvIn):
    """
    Send phone number verification code.
    """
    # In a real application, you would send a verification code to the phone number.
    # For now, we'll just return a success message.
    return {"message": "Verification code sent successfully"}

@router.post("/register/check-pnv")
def check_pnv(pnv_check_in: PnvCheckIn):
    """
    Check phone number verification code.
    """
    # In a real application, you would check the verification code.
    # For now, we'll just return a success message.
    return {"message": "Phone number verified successfully"}
