
import os
import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# --- SMTP Configuration ---
# IMPORTANT: You must configure these environment variables in your .env file
# for the email service to work.
SMTP_SERVER = os.environ.get("SMTP_SERVER")
SMTP_PORT = os.environ.get("SMTP_PORT")
SMTP_USERNAME = os.environ.get("SMTP_USERNAME")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")

# A simple in-memory store for verification tokens. In a real production application,
# you would use a persistent database (e.g., Redis or your main SQL database)
# with expiration times for these tokens.
verification_tokens = {}

def send_verification_email(email: str):
    """
    Generates a verification token and sends a verification email.
    """
    if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SENDER_EMAIL]):
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("!!! SMTP Email settings are not configured.            !!!")
        print("!!! Email will not be sent. Please configure your .env file. !!!")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        # In a real app, you might raise an exception here
        return None

    token = secrets.token_urlsafe(16)
    # In a real app, store this token in the database associated with the user_id
    # and set an expiration time.
    verification_tokens[email] = token
    
    # This should be a URL to your frontend application
    verification_link = f"http://localhost:8000/verify-email?token={token}&email={email}"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Verify Your Email Address"
    message["From"] = SENDER_EMAIL
    message["To"] = email

    text = f"""
    Hi,
    Thanks for signing up! Please verify your email address by clicking the link below.
    {verification_link}
    """
    html = f"""
    <html>
    <body>
        <p>Hi,<br>
        Thanks for signing up! Please verify your email address by clicking the link below.</p>
        <p><a href="{verification_link}">Verify Email</a></p>
    </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    try:
        with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT)) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SENDER_EMAIL, email, message.as_string())
            print(f"Verification email sent to {email}")
    except Exception as e:
        print(f"Error sending email: {e}")
        # In a real app, you'd want more robust error handling and logging
        return None
    
    return token


def verify_email_token(email: str, token: str):
    """
    Verifies the email verification token.
    In a real app, this would look up the token in the database.
    """
    if email in verification_tokens and verification_tokens[email] == token:
        # Once verified, the token should be deleted so it can't be used again.
        del verification_tokens[email]
        return True
    return False

