
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.core.deps import get_db
from app.tests.utils.user import create_random_user
from app.tests.utils.room import create_random_room


client = TestClient(app)


def test_e2ee_messaging(db: Session):
    user1 = create_random_user(db)
    user2 = create_random_user(db)

    # Simulate key exchange
    # In a real application, we would use a proper key exchange mechanism
    from app.services.e2ee.x3dh import X3DH
    from app.services.e2ee.double_ratchet import DoubleRatchet
    from cryptography.hazmat.primitives.asymmetric import ec

    private_key1 = ec.generate_private_key(ec.SECP256R1())
    public_key1 = private_key1.public_key()

    private_key2 = ec.generate_private_key(ec.SECP256R1())
    public_key2 = private_key2.public_key()

    shared_key1 = private_key1.exchange(ec.ECDH(), public_key2)
    shared_key2 = private_key2.exchange(ec.ECDH(), public_key1)

    dr1 = DoubleRatchet(shared_key1)
    dr2 = DoubleRatchet(shared_key2)

    # Test message encryption and decryption
    message = "This is a secret message."
    encrypted_message, nonce = dr1.encrypt(message.encode())
    decrypted_message = dr2.decrypt(encrypted_message, nonce)

    assert decrypted_message.decode() == message


def test_e2ee_rooms(db: Session):
    user = create_random_user(db)
    room = create_random_room(db, user)

    # Test SFrame encryption and decryption
    from app.services.e2ee.sframe import SFrame
    import os

    key = os.urandom(32)
    sframe = SFrame(key)

    media_frame = b"This is a media frame."
    encrypted_frame, nonce = sframe.encrypt(media_frame)
    decrypted_frame = sframe.decrypt(encrypted_frame, nonce)

    assert decrypted_frame == media_frame
