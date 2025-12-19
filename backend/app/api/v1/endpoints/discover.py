from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import discover
from typing import List, Optional

router = APIRouter()

@router.get("/search")
def search_all(
    query: str = Query(..., min_length=1, max_length=100),
    type: Optional[str] = Query(None, description="Filter by type (user, post, or hashtag)"),
    db: Session = Depends(get_db)
):
    """
    Search for users, posts, and hashtags.
    """
    results = discover.search(db, query, type)
    return results
