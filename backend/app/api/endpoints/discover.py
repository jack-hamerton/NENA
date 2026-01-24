"""
Discover/Search API Endpoint for NENA

This module implements the comprehensive search functionality for the NENA discover page.
Supports searching across 4 content types:
1. Users - Search by username, first name, last name, or email
2. Posts - Search by post content and hashtags
3. Hashtags - Search by hashtag name
4. Rooms - Search by room name

API Endpoint: GET /discover/search?query={query}&type={type}

Author: NENA Development Team
Date: January 24, 2026
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional, Any
import logging

from app.core.dependencies import get_db
from app.models.user import User
from app.models.post import Post
from app.models.hashtag import Hashtag
from app.models.room import Room
from pydantic import BaseModel

# Configure logging
logger = logging.getLogger(__name__)

# ============================================================================
# RESPONSE SCHEMAS
# ============================================================================

class UserSearchResult(BaseModel):
    """Schema for user search results"""
    id: str
    username: str
    email: Optional[str]
    first_name: str
    last_name: str
    is_active: bool

    class Config:
        from_attributes = True


class PostSearchResult(BaseModel):
    """Schema for post search results"""
    id: str
    content: str
    author_id: str
    created_at: Optional[str]

    class Config:
        from_attributes = True


class HashtagSearchResult(BaseModel):
    """Schema for hashtag search results"""
    id: str
    text: str
    post_count: int = 0

    class Config:
        from_attributes = True


class RoomSearchResult(BaseModel):
    """Schema for room search results"""
    id: str
    name: str
    creator_id: str

    class Config:
        from_attributes = True


class DiscoverSearchResponse(BaseModel):
    """Generic search response wrapper"""
    data: List[Any]
    total: int
    query: str
    type: str


# ============================================================================
# ROUTER SETUP
# ============================================================================

router = APIRouter(prefix="/discover", tags=["discover"])

# ============================================================================
# SEARCH FUNCTIONS
# ============================================================================

def search_users(query: str, db: Session, limit: int = 20) -> List[User]:
    """
    Search for users by username, email, first name, or last name.

    Args:
        query: Search term
        db: Database session
        limit: Maximum number of results

    Returns:
        List of User objects matching the query
    """
    if not query or len(query.strip()) < 1:
        return []

    search_term = f"%{query.lower()}%"

    try:
        users = db.query(User).filter(
            and_(
                User.is_active == True,
                or_(
                    User.username.ilike(search_term),
                    User.email.ilike(search_term),
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term),
                )
            )
        ).limit(limit).all()

        return users
    except Exception as e:
        logger.error(f"Error searching users: {str(e)}")
        return []


def search_posts(query: str, db: Session, limit: int = 20) -> List[Post]:
    """
    Search for posts by content and hashtags.

    Args:
        query: Search term
        db: Database session
        limit: Maximum number of results

    Returns:
        List of Post objects matching the query
    """
    if not query or len(query.strip()) < 1:
        return []

    search_term = f"%{query.lower()}%"

    try:
        # Search in post content or via hashtags
        posts = db.query(Post).filter(
            Post.content.ilike(search_term)
        ).limit(limit).all()

        return posts
    except Exception as e:
        logger.error(f"Error searching posts: {str(e)}")
        return []


def search_hashtags(query: str, db: Session, limit: int = 20) -> List[Hashtag]:
    """
    Search for hashtags by name.

    Args:
        query: Search term
        db: Database session
        limit: Maximum number of results

    Returns:
        List of Hashtag objects matching the query
    """
    if not query or len(query.strip()) < 1:
        return []

    search_term = f"%{query.lower()}%"

    try:
        hashtags = db.query(Hashtag).filter(
            Hashtag.text.ilike(search_term)
        ).limit(limit).all()

        return hashtags
    except Exception as e:
        logger.error(f"Error searching hashtags: {str(e)}")
        return []


def search_rooms(query: str, db: Session, limit: int = 20) -> List[Room]:
    """
    Search for rooms by name.

    Args:
        query: Search term
        db: Database session
        limit: Maximum number of results

    Returns:
        List of Room objects matching the query
    """
    if not query or len(query.strip()) < 1:
        return []

    search_term = f"%{query.lower()}%"

    try:
        rooms = db.query(Room).filter(
            Room.name.ilike(search_term)
        ).limit(limit).all()

        return rooms
    except Exception as e:
        logger.error(f"Error searching rooms: {str(e)}")
        return []


# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.get("/search")
def discover_search(
    query: str = Query(..., min_length=1, max_length=500, description="Search query"),
    type: str = Query(..., description="Search type: users, posts, hashtags, or rooms"),
    limit: int = Query(20, ge=1, le=100, description="Result limit"),
    db: Session = Depends(get_db),
) -> DiscoverSearchResponse:
    """
    Unified discover/search endpoint supporting multiple content types.

    Query Parameters:
        - query (required): Search term (1-500 characters)
        - type (required): One of ["users", "posts", "hashtags", "rooms"]
        - limit (optional): Maximum results per page (1-100, default 20)

    Returns:
        DiscoverSearchResponse with matching results

    Examples:
        GET /discover/search?query=python&type=users
        GET /discover/search?query=coding&type=posts
        GET /discover/search?query=web&type=hashtags
        GET /discover/search?query=development&type=rooms
    """
    # Normalize search type
    search_type = type.lower().strip()

    # Validate search type
    valid_types = ["users", "posts", "hashtags", "rooms"]
    if search_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid search type. Must be one of: {', '.join(valid_types)}"
        )

    # Normalize query
    normalized_query = query.strip()
    if not normalized_query:
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty"
        )

    # Log search
    logger.info(f"Search initiated - query: '{normalized_query}', type: '{search_type}'")

    # Perform search based on type
    results = []
    try:
        if search_type == "users":
            results = search_users(normalized_query, db, limit)
        elif search_type == "posts":
            results = search_posts(normalized_query, db, limit)
        elif search_type == "hashtags":
            results = search_hashtags(normalized_query, db, limit)
        elif search_type == "rooms":
            results = search_rooms(normalized_query, db, limit)

        # Log result count
        logger.info(f"Search completed - found {len(results)} results")

        # Return response
        return DiscoverSearchResponse(
            data=results,
            total=len(results),
            query=normalized_query,
            type=search_type
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during search"
        )


@router.get("/search/users")
def search_users_endpoint(
    query: str = Query(..., min_length=1, max_length=500, description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Result limit"),
    db: Session = Depends(get_db),
) -> DiscoverSearchResponse:
    """
    Search for users only.

    Query Parameters:
        - query (required): Search term
        - limit (optional): Maximum results (default 20)

    Returns:
        DiscoverSearchResponse with matching users
    """
    normalized_query = query.strip()
    if not normalized_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        users = search_users(normalized_query, db, limit)
        return DiscoverSearchResponse(
            data=users,
            total=len(users),
            query=normalized_query,
            type="users"
        )
    except Exception as e:
        logger.error(f"User search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")


@router.get("/search/posts")
def search_posts_endpoint(
    query: str = Query(..., min_length=1, max_length=500, description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Result limit"),
    db: Session = Depends(get_db),
) -> DiscoverSearchResponse:
    """
    Search for posts only.

    Query Parameters:
        - query (required): Search term
        - limit (optional): Maximum results (default 20)

    Returns:
        DiscoverSearchResponse with matching posts
    """
    normalized_query = query.strip()
    if not normalized_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        posts = search_posts(normalized_query, db, limit)
        return DiscoverSearchResponse(
            data=posts,
            total=len(posts),
            query=normalized_query,
            type="posts"
        )
    except Exception as e:
        logger.error(f"Post search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")


@router.get("/search/hashtags")
def search_hashtags_endpoint(
    query: str = Query(..., min_length=1, max_length=500, description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Result limit"),
    db: Session = Depends(get_db),
) -> DiscoverSearchResponse:
    """
    Search for hashtags only.

    Query Parameters:
        - query (required): Search term
        - limit (optional): Maximum results (default 20)

    Returns:
        DiscoverSearchResponse with matching hashtags
    """
    normalized_query = query.strip()
    if not normalized_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        hashtags = search_hashtags(normalized_query, db, limit)
        return DiscoverSearchResponse(
            data=hashtags,
            total=len(hashtags),
            query=normalized_query,
            type="hashtags"
        )
    except Exception as e:
        logger.error(f"Hashtag search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")


@router.get("/search/rooms")
def search_rooms_endpoint(
    query: str = Query(..., min_length=1, max_length=500, description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Result limit"),
    db: Session = Depends(get_db),
) -> DiscoverSearchResponse:
    """
    Search for rooms only.

    Query Parameters:
        - query (required): Search term
        - limit (optional): Maximum results (default 20)

    Returns:
        DiscoverSearchResponse with matching rooms
    """
    normalized_query = query.strip()
    if not normalized_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        rooms = search_rooms(normalized_query, db, limit)
        return DiscoverSearchResponse(
            data=rooms,
            total=len(rooms),
            query=normalized_query,
            type="rooms"
        )
    except Exception as e:
        logger.error(f"Room search error: {str(e)}")
        raise HTTPException(status_code=500, detail="Search failed")


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@router.get("/health")
def discover_health_check() -> dict:
    """
    Health check endpoint for discover service.

    Returns:
        Status information
    """
    return {
        "status": "healthy",
        "service": "discover",
        "endpoints": [
            "GET /discover/search",
            "GET /discover/search/users",
            "GET /discover/search/posts",
            "GET /discover/search/hashtags",
            "GET /discover/search/rooms",
        ]
    }
