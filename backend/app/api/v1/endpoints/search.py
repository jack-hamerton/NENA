
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any

from app import crud
from app.api import deps
from app.utils.crypto import crypto_utils

router = APIRouter()


@router.get("/")
def search(
    db: Session = Depends(deps.get_db),
    query: str = "",
) -> Any:
    """
    Search for users, posts, and hashtags.
    """
    decrypted_query = crypto_utils.decrypt(query)
    users = crud.user.search(db, query=decrypted_query)
    posts = crud.post.search(db, query=decrypted_query)
    hashtags = crud.hashtag.search(db, query=decrypted_query)
    return users + posts + hashtags
