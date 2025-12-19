from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.services.moderation import ModerationService

router = APIRouter()

@router.post("/", response_model=schemas.Message)
def create_message(
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
    return message
