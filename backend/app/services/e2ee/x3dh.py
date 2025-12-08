
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from .double_ratchet import DoubleRatchet

# This is a simplified implementation of the X3DH protocol.

class X3DH:
    def __init__(self, key_store):
        self.key_store = key_store

    def establish_shared_secret(self, other_user_public_identity_key_pem, other_user_signed_public_pre_key_pem, other_user_signature):
        # 1. Verify the signature of the other user's pre-key
        other_user_public_identity_key = serialization.load_pem_public_key(other_user_public_identity_key_pem)
        other_user_public_pre_key = serialization.load_pem_public_key(other_user_signed_public_pre_key_pem)
        try:
            other_user_public_identity_key.verify(
                other_user_signature,
                other_user_signed_public_pre_key_pem,
                ec.ECDH()
            )
        except Exception as e:
            raise Exception('Invalid signature for the other user\'s pre-key')

        # 2. Create a new DoubleRatchet instance
        shared_key = self.key_store.identity_key.exchange(ec.ECDH(), other_user_public_pre_key)
        double_ratchet = DoubleRatchet(shared_key)

        return double_ratchet
