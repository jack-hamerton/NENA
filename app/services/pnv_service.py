
import random

# Mock PNV service

def send_pnv_request(phone_number: str, country_code: str):
    """
    Sends a phone number verification request to the user's device.
    Returns a verification ID.
    """
    print(f"Sending PNV request to {country_code}{phone_number}")
    return "mock_verification_id"

def check_pnv_request(verification_id: str, code: str):
    """
    Checks the verification code entered by the user.
    Returns True if the code is valid, False otherwise.
    """
    print(f"Checking PNV code {code} for verification ID {verification_id}")
    return code == "1234"
