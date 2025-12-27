
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.schemas.document import DocumentRead, DocumentCreate # Ensure schemas are imported
from app.core.deps import get_db

router = APIRouter()

@router.get("/{document_id}", response_model=DocumentRead)
def get_or_create_document(document_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a document by its document_id. If it doesn't exist, create it.
    """
    document = crud.crud_document.get_or_create(db, document_id=document_id)
    if not document:
        # This part of the code should ideally not be reached because get_or_create handles it.
        # However, it's good practice to have this check.
        raise HTTPException(status_code=404, detail="Document could not be created or found")
    return document

@router.put("/{document_id}", response_model=DocumentRead)
def update_document(document_id: str, content: str, db: Session = Depends(get_db)):
    """
    Update a document's content.
    """
    updated_document = crud.crud_document.update_document_content(
        db, document_id=document_id, content=content
    )
    if not updated_document:
        raise HTTPException(status_code=404, detail="Document not found")
    return updated_document
