
from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.document import DocumentCreate

# Get a document by its unique document_id
def get_document_by_doc_id(db: Session, *, document_id: str) -> Document | None:
    return db.query(Document).filter(Document.document_id == document_id).first()

# Create a new document
def create_document(db: Session, *, obj_in: DocumentCreate) -> Document:
    db_obj = Document(
        document_id=obj_in.document_id,
        content=obj_in.content or ''
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

# The main function to get or create a document
def get_or_create(db: Session, *, document_id: str) -> Document:
    document = get_document_by_doc_id(db=db, document_id=document_id)
    if not document:
        document = create_document(db=db, obj_in=DocumentCreate(document_id=document_id))
    return document

# Update a document's content
def update_document_content(db: Session, *, document_id: str, content: str) -> Document | None:
    document = get_document_by_doc_id(db=db, document_id=document_id)
    if document:
        document.content = content
        db.commit()
        db.refresh(document)
    return document
