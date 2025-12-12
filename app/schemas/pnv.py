
from pydantic import BaseModel

class PNVRequest(BaseModel):
    phone_number: str
    country_code: str

class PNVCheck(BaseModel):
    phone_number: str
    country_code: str
    code: str
