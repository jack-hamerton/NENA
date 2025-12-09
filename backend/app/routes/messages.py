
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.crud import message as crud_message
from app.schemas import message as schema_message
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.e2ee.x3dh import X3DH
from app.services.e2ee.double_ratchet import DoubleRatchet

router = APIRouter()

# Placeholder for a key store
# In a real application, this would be a secure and robust system
key_store = {}

@router.post("/keys")
def exchange_keys(public_identity_key: str, signed_public_pre_key: str, signature: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id not in key_store:
        key_store[current_user.id] = {"public_identity_key": public_identity_key, "signed_public_pre_key": signed_public_pre_key, "signature": signature}
    x3dh = X3DH(current_user.id)
    # In a real application, we would store and retrieve the other user's keys from the database
    double_ratchet = x3dh.establish_shared_secret(public_identity_key, signed_public_pre_key, signature)
    # Store the DoubleRatchet instance for the current user
    key_store[current_user.id]["double_ratchet"] = double_ratchet
    return {"status": "success"}

@router.get("/keys/{user_id}")
def get_keys(user_id: int, db: Session = Depends(get_db)):
    if user_id not in key_store:
        raise HTTPException(status_code=404, detail="User not found")
    return key_store[user_id]

@router.get("/{recipient_id}", response_model=List[schema_message.Message])
def read_messages(
    recipient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    messages = crud_message.get_messages(db, sender_id=current_user.id, recipient_id=recipient_id, skip=skip, limit=limit)
    if current_user.id in key_store and "double_ratchet" in key_store[current_user.id]:
        double_ratchet = key_store[current_user.id]["double_ratchet"]
        for msg in messages:
            msg.content = double_ratchet.decrypt(msg.content, msg.nonce)
    return messages

@router.post("/", response_model=schema_message.Message)

def create_message(
    message: schema_message.MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id in key_store and "double_ratchet" in key_store[current_user.id]:
        double_ratchet = key_store[current_user.id]["double_ratchet"]
        encrypted_content, nonce = double_ratchet.encrypt(message.content)
        message.content = encrypted_content
        message.nonce = nonce
    return crud_message.create_message(db=db, message=message, sender_id=current_user.id)
