from cryptography.fernet import Fernet
import os

# WARNING: This is a placeholder key and should be replaced with a securely
# managed key in a production environment.
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "your-super-secret-key_your-super-secret-key_your-super-secret-key")

cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def decrypt(encrypted_text: str) -> str:
    """Decrypts text."""
    if not encrypted_text:
        return ""
    decrypted_bytes = cipher_suite.decrypt(encrypted_text.encode())
    return decrypted_bytes.decode()
