
import smtplib
from email.mime.text import MIMEText
from app.core.config import settings

def send_email(to_email: str, subject: str, message: str):
    """Sends an email using the configured SMTP server."""
    # This is a placeholder for a real email sending service.
    # In a production environment, you would use a service like SendGrid, Mailgun, or AWS SES.
    print(f"Sending email to {to_email}")
    print(f"Subject: {subject}")
    print(f"Message: {message}")

def send_password_reset_email(email_to: str, username: str, token: str):
    """Sends a password reset email to the user."""
    reset_url = f"http://localhost:3000/reset-password?token={token}"
    subject = "Password Reset Request"
    message = f"Hi {username},\n\nClick the link to reset your password: {reset_url}"
    send_email(email_to, subject, message)
