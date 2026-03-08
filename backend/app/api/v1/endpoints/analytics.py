
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid

from app import crud, models, schemas
from app.core.dependencies import get_db

router = APIRouter()


@router.get("/advocacy-matrix/{user_id}", response_model=schemas.analytics.AdvocacyImpactMatrix)
def get_advocacy_impact_matrix(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
) -> Any:
    """
    Calculates the Advocacy Impact Matrix for a given user.
    This endpoint processes a user's activities to build a 3x3 matrix representing
    their advocacy efforts and generates a strategic recommendation.
    """

    # 1. Define Categories (This is the core business logic)
    def categorize_activity(activity: Any) -> tuple[str, str] | None:
        audience = activity.audience if hasattr(activity, 'audience') else 'public'

        if isinstance(activity, models.Post):
            return "awareness", audience

        if isinstance(activity, models.Document):
            return "will", audience

        if isinstance(activity, models.Poll):
            return "awareness", audience

        if isinstance(activity, models.Study):
            return "will", audience

        if isinstance(activity, models.Event):
            # You might have a property on your Event model to determine if it is action-oriented
            return "action", audience

        if isinstance(activity, models.Challenge):
            return "action", audience

        return None

    # 2. Fetch User Activities
    posts = db.query(models.Post).filter(models.Post.author_id == user_id).all()
    documents = db.query(models.Document).filter(models.Document.author_id == user_id).all()
    polls = db.query(models.Poll).filter(models.Poll.author_id == user_id).all()
    studies = db.query(models.Study).filter(models.Study.author_id == user_id).all()
    events = db.query(models.Event).filter(models.Event.owner_id == user_id).all()
    challenges = db.query(models.Challenge).filter(models.Challenge.author_id == user_id).all()

    all_activities = posts + documents + polls + studies + events + challenges

    # 3. Build the Matrix
    matrix = {
        "awareness": {"public": 0, "influencers": 0, "stakeholders": 0},
        "will": {"public": 0, "influencers": 0, "stakeholders": 0},
        "action": {"public": 0, "influencers": 0, "stakeholders": 0},
    }

    for activity in all_activities:
        result = categorize_activity(activity)
        if result:
            category, audience_str = result
            if audience_str in matrix[category]:
                matrix[category][audience_str] += 1

    # 4. Generate Recommendation
    recommendation = "Keep up the great work!"
    min_val = float('inf')
    min_cell = (None, None)

    for category, audiences in matrix.items():
        for audience, value in audiences.items():
            if value < min_val:
                min_val = value
                min_cell = (category, audience)

    cat, aud = min_cell
    if cat and aud:
        recommendation = f"You have an opportunity to grow. Focus on building **{cat}** with **{aud}**. Try creating more content or starting a discussion targeted at this group."


    # 5. Format the response
    response_matrix = [
        [matrix["awareness"]["public"], matrix["awareness"]["influencers"], matrix["awareness"]["stakeholders"]],
        [matrix["will"]["public"], matrix["will"]["influencers"], matrix["will"]["stakeholders"]],
        [matrix["action"]["public"], matrix["action"]["influencers"], matrix["action"]["stakeholders"]],
    ]

    return {
        "matrix": response_matrix,
        "recommendation": recommendation
    }


@router.get("/me/engagement")
def get_user_engagement(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_db),
):
    """
    Get engagement metrics for the current user.
    """
    # Get user's post count
    posts_count = db.query(models.Post).filter(models.Post.author_id == current_user.id).count()

    # Get user's comment count (assuming comments are stored in a separate table)
    comments_count = 0  # Placeholder - implement when comments table exists

    # Get following count
    following_count = db.query(models.Follower).filter(models.Follower.follower_id == current_user.id).count()

    # Get followers count
    followers_count = db.query(models.Follower).filter(models.Follower.followed_id == current_user.id).count()

    return {
        "posts_count": posts_count,
        "comments_count": comments_count,
        "following_count": following_count,
        "followers_count": followers_count
    }


@router.get("/me/post-engagement")
def get_user_post_engagement(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_db),
):
    """
    Get post engagement metrics for the current user.
    """
    # Get user's posts with engagement data
    posts = db.query(models.Post).filter(models.Post.author_id == current_user.id).all()

    post_engagement = []
    for post in posts:
        # Get comments count (placeholder - implement when comments exist)
        comments_count = 0

        # Get likes count (placeholder - implement when likes exist)
        likes_count = 0

        post_engagement.append({
            "post_id": post.id,
            "text": post.content[:100] if post.content else "",
            "comments_count": comments_count,
            "likes_count": likes_count
        })

    return post_engagement
