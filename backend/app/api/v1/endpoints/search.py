from fastapi import APIRouter, HTTPException
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os

router = APIRouter()

# This key should be securely derived from a shared secret, e.g., using Diffie-Hellman
# For demonstration, we'll use a hardcoded key. 
# In a real application, this would be handled by a key exchange mechanism.
ENCRYPTION_KEY = bytes.fromhex('c293b7a8b6a3a41a8790203a74b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3')

def decrypt(text: str) -> str:
    try:
        text_parts = text.split(':')
        iv = bytes.fromhex(text_parts[0])
        encrypted_text = bytes.fromhex(text_parts[1])
        cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted = decryptor.update(encrypted_text) + decryptor.finalize()
        # Remove padding
        unpadder = lambda s: s[:-ord(s[len(s)-1:])]
        return unpadder(decrypted).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid encrypted query")

@router.get("/search")
def search(query: str):
    decrypted_query = decrypt(query)

    # Mock search results
    mock_users = [
        {"id": 1, "name": "John Doe", "username": "johndoe"},
        {"id": 2, "name": "Jane Doe", "username": "janedoe"},
    ]
    mock_posts = [
        {"id": 1, "title": "First Post", "content": f"Content mentioning {decrypted_query}"},
        {"id": 2, "title": "Second Post", "content": f"More content about {decrypted_query}"},
    ]
    mock_hashtags = [
        {"id": 1, "name": decrypted_query},
        {"id": 2, "name": f"{decrypted_query}_too"},
    ]

    results = {
        "users": [user for user in mock_users if decrypted_query.lower() in user["name"].lower()],
        "posts": mock_posts,
        "hashtags": mock_hashtags,
    }

    return results
