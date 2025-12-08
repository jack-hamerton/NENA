
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

class SFrame:
    def __init__(self, key):
        self.key = key

    def encrypt(self, media_frame):
        nonce = os.urandom(12)
        return AESGCM(self.key).encrypt(nonce, media_frame, None), nonce

    def decrypt(self, encrypted_frame, nonce):
        return AESGCM(self.key).decrypt(nonce, encrypted_frame, None)
