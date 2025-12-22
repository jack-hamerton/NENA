
from cryptography.fernet import Fernet

# This is a mock key for demonstration purposes. In a real application, this key should be stored securely.
key = b'i9BwE22i-B_E8tS_nJ1bBwE22i-B_E8tS_nJ1bBwE='

class CryptoUtils:
    def __init__(self, key):
        self.cipher_suite = Fernet(key)

    def encrypt(self, text):
        return self.cipher_suite.encrypt(text.encode()).decode()

    def decrypt(self, encrypted_text):
        return self.cipher_suite.decrypt(encrypted_text.encode()).decode()

crypto_utils = CryptoUtils(key)
