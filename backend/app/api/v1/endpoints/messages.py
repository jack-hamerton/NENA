from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.services.moderation import ModerationService
from app.websockets import manager
from typing import List

router = APIRouter()

@router.get("/{conversation_id}", response_model=List[schemas.Message])
def read_messages(
    conversation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> List[models.Message]:
    """
    Retrieve messages for a conversation.
    """
    conversation = crud.conversation.get(db=db, id=conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if current_user.id not in [p.id for p in conversation.participants]:
        raise HTTPException(status_code=403, detail="Not authorized to view this conversation")

    messages = crud.message.get_multi_by_conversation(
        db=db, conversation_id=conversation_id, skip=0, limit=100
    )
    return messages

@router.post("/", response_model=schemas.Message)
async def create_message(
    *, 
    db: Session = Depends(deps.get_db),
    message_in: schemas.MessageCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> models.Message:
    """
    Create new message.
    """
    moderation_service = ModerationService()
    moderation_result = moderation_service.moderate_text(message_in.content)
    if moderation_result.is_flagged:
        raise HTTPException(status_code=400, detail=f"Message content flagged for: {moderation_result.details}")

    recipient = crud.user.get(db=db, id=message_in.recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    conversation = crud.conversation.get_by_participants(db=db, user_a_id=current_user.id, user_b_id=recipient.id)
    if not conversation:
        conversation = crud.conversation.create(db=db, obj_in=schemas.ConversationCreate(participant_ids=[current_user.id, recipient.id]))

    message = crud.message.create(
        db=db, 
        obj_in=schemas.MessageCreate(
            content=message_in.content, 
            sender_id=current_user.id, 
            conversation_id=conversation.id
        )
    )

    # Send message to recipient in real-time
    await manager.send_personal_message(message.dict(), recipient.id)

    return message
