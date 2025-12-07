
from pydantic import BaseModel

class PNVRequest(BaseModel):
    phone_number: str
    country_code: str

class PNVCheck(BaseModel):
    verification_id: str
    code: str
