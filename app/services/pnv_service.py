
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

# --- Twilio Configuration ---
# IMPORTANT: Replace these with your actual Twilio credentials before deploying to production.
# You can get these from your Twilio account dashboard: https://www.twilio.com/console
TWILIO_ACCOUNT_SID = "your_account_sid"  # Replace with your Account SID
TWILIO_AUTH_TOKEN = "your_auth_token"    # Replace with your Auth Token
VERIFY_SERVICE_SID = "your_verify_service_sid"  # Replace with your Verify Service SID

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_pnv_request(phone_number: str, country_code: str):
    """
    Sends a phone number verification request to the user's device using Twilio Verify.
    Returns the verification SID if successful, otherwise None.
    """
    try:
        verification = client.verify.v2.services(VERIFY_SERVICE_SID).verifications.create(
            to=f"{country_code}{phone_number}", channel="sms"
        )
        return verification.sid
    except TwilioRestException as e:
        print(f"Error sending PNV request: {e}")
        return None

def check_pnv_request(phone_number: str, country_code: str, code: str):
    """
    Checks the verification code entered by the user using Twilio Verify.
    Returns True if the code is valid, False otherwise.
    """
    try:
        verification_check = client.verify.v2.services(
            VERIFY_SERVICE_SID
        ).verification_checks.create(to=f"{country_code}{phone_number}", code=code)
        return verification_check.status == "approved"
    except TwilioRestException as e:
        print(f"Error checking PNV code: {e}")
        return False
