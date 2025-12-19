from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import Hashtag, post_hashtags

def get_trending_hashtags(db: Session, limit: int = 10):
    """
    Gets the trending hashtags.
    """
    hashtag_counts = (
        db.query(Hashtag, func.count(post_hashtags.c.post_id).label("post_count"))
        .join(post_hashtags)
        .group_by(Hashtag)
        .order_by(func.count(post_hashtags.c.post_id).desc())
        .limit(limit)
        .all()
    )

    trending_hashtags = []
    for hashtag, post_count in hashtag_counts:
        trending_hashtags.append({
            "id": hashtag.id,
            "text": hashtag.text,
            "post_count": post_count,
        })

    return trending_hashtags
