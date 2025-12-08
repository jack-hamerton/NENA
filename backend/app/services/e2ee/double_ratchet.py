
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

# This is a simplified implementation of the Double Ratchet algorithm.
# A real implementation would be more complex and would involve a state machine.

class DoubleRatchet:
    def __init__(self, shared_key):
        self.root_key = shared_key
        self.sending_key = shared_key
        self.receiving_key = shared_key
        self.previous_receiving_key = None

    def encrypt(self, plaintext):
        if not self.sending_key:
            raise Exception('Double Ratchet not initialized')
        nonce = os.urandom(12)
        ciphertext = AESGCM(self.sending_key).encrypt(nonce, plaintext, None)
        # In a real implementation, we would update the sending key after each message.
        return ciphertext, nonce

    def decrypt(self, ciphertext, nonce):
        if not self.receiving_key:
            raise Exception('Double Ratchet not initialized')
        try:
            return AESGCM(self.receiving_key).decrypt(nonce, ciphertext, None)
        except Exception as e:
            # If decryption fails, try the previous receiving key (out-of-order message)
            if self.previous_receiving_key:
                return AESGCM(self.previous_receiving_key).decrypt(nonce, ciphertext, None)
            else:
                raise e
