from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Conversation)
def create_conversation(
    *, 
    db: Session = Depends(deps.get_db),
    conversation_in: schemas.ConversationCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> models.Conversation:
    """
    Create new conversation.
    """
    participants = []
    for user_id in conversation_in.participant_ids:
        user = crud.user.get(db=db, id=user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        participants.append(user)
    
    conversation = crud.conversation.create(db=db, obj_in=schemas.ConversationCreate())
    conversation.participants.extend(participants)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

@router.get("/{conversation_id}", response_model=schemas.Conversation)
def get_conversation(
    *, 
    db: Session = Depends(deps.get_db),
    conversation_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> models.Conversation:
    """
    Get conversation by ID.
    """
    conversation = crud.conversation.get(db=db, id=conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return conversation

@router.get("/{conversation_id}/messages", response_model=list[schemas.Message])
def get_conversation_messages(
    *, 
    db: Session = Depends(deps.get_db),
    conversation_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> list[models.Message]:
    """
    Get messages for a conversation.
    """
    conversation = crud.conversation.get(db=db, id=conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if current_user not in conversation.participants:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return conversation.messages
