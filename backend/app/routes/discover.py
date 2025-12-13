from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ...dependencies import get_db
from ...services import discover

router = APIRouter()

@router.get("/search")
def search_all(query: str = Query(..., min_length=1, max_length=100), db: Session = Depends(get_db)):
    """
    Search for users, rooms, and posts.
    """
    results = discover.search(db, query)
    return results
