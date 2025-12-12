
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from app.models import user as user_model, post as post_model, comment as comment_model, follower as follower_model, like as like_model
from app.schemas import analytics as analytics_schema
from typing import List
from datetime import datetime, timedelta

def get_engagement_metrics(db: Session, user_id: int) -> analytics_schema.EngagementMetrics:
    """Gathers engagement metrics for a specific user."""
    
    user_posts = db.query(post_model.Post.id).filter(post_model.Post.owner_id == user_id).subquery()

    # Simplified impressions: number of followers for each post
    impressions = db.query(func.sum(user_model.User.followers_count)).filter(user_model.User.id == user_id).scalar() or 0

    likes = db.query(func.count(like_model.Like.id)).filter(like_model.Like.post_id.in_(user_posts)).scalar()
    replies = db.query(func.count(comment_model.Comment.id)).filter(comment_model.Comment.post_id.in_(user_posts)).scalar()
    
    # Mocked data for metrics not easily available
    reposts = 0  # Assuming no repost model
    clicks = 0   # Assuming no click tracking model

    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    follows = db.query(func.count(follower_model.Follower.id)).filter(
        follower_model.Follower.following_id == user_id,
        follower_model.Follower.created_at > thirty_days_ago
    ).scalar()

    total_engagements = likes + replies + reposts + clicks + follows
    engagement_rate = (total_engagements / impressions) * 100 if impressions > 0 else 0

    return analytics_schema.EngagementMetrics(
        total_engagements=total_engagements,
        engagement_rate=engagement_rate,
        impressions=impressions,
        likes=likes,
        replies=replies,
        reposts=reposts,
        clicks=clicks,
        follows=follows
    )


def get_content_type_performance(db: Session, user_id: int) -> List[analytics_schema.ContentTypePerformance]:
    """Analyzes performance based on content type."""
    results = (
        db.query(
            post_model.Post.content_type,
            func.count(post_model.Post.id).label("total_posts"),
            (func.count(like_model.Like.id) + func.count(comment_model.Comment.id)).label("total_engagement")
        )
        .outerjoin(like_model.Like, post_model.Post.id == like_model.Like.post_id)
        .outerjoin(comment_model.Comment, post_model.Post.id == comment_model.Comment.post_id)
        .filter(post_model.Post.owner_id == user_id)
        .group_by(post_model.Post.content_type)
        .all()
    )

    return [
        analytics_schema.ContentTypePerformance(
            content_type=res.content_type or "text",
            total_posts=res.total_posts,
            average_engagement=(res.total_engagement / res.total_posts) if res.total_posts > 0 else 0
        ) for res in results
    ]

def get_top_performing_posts(db: Session, user_id: int, limit: int = 5) -> List[analytics_schema.TopPost]:
    """Gets the top performing posts based on engagement."""
    top_posts_query = (
        db.query(
            post_model.Post,
            (func.count(like_model.Like.id) + func.count(comment_model.Comment.id)).label("engagement")
        )
        .outerjoin(like_model.Like, post_model.Post.id == like_model.Like.post_id)
        .outerjoin(comment_model.Comment, post_model.Post.id == comment_model.Comment.post_id)
        .filter(post_model.Post.owner_id == user_id)
        .group_by(post_model.Post.id)
        .order_by(func.count(like_model.Like.id + comment_model.Comment.id).desc())
        .limit(limit)
        .all()
    )

    return [
        analytics_schema.TopPost(
            post_id=post.id,
            text=post.text,
            author=post.owner.full_name,
            comments_count=len(post.comments),
            likes_count=len(post.likes),
            engagement_rate=engagement # Using total engagement as rate for simplicity
        ) for post, engagement in top_posts_query
    ]

def get_hashtag_performance(db: Session, user_id: int) -> List[analytics_schema.HashtagPerformance]:
    # This is a mocked response as hashtag models are not defined
    return [
        analytics_schema.HashtagPerformance(hashtag="#Nena", reach=1500, engagement=200),
        analytics_schema.HashtagPerformance(hashtag="#AI", reach=1200, engagement=150),
    ]

def get_follower_analytics(db: Session, user_id: int) -> List[analytics_schema.FollowerAnalytics]:
    # Mocked: a real implementation would query snapshots or logs of follower counts
    return [
        analytics_schema.FollowerAnalytics(date="2023-01-01", follower_change=10, total_followers=1010),
        analytics_schema.FollowerAnalytics(date="2023-02-01", follower_change=15, total_followers=1025),
    ]

def get_follower_activity(db: Session, user_id: int) -> List[analytics_schema.FollowerActivity]:
    # Mocked: requires analyzing follower activity timestamps
    return [analytics_schema.FollowerActivity(hour=i, activity_level=0.5) for i in range(24)]

def get_audience_interests(db: Session, user_id: int) -> List[analytics_schema.AudienceInterest]:
    # Mocked: requires NLP on follower comments/posts
    return [
        analytics_schema.AudienceInterest(topic="AI Development", engagement_score=0.8),
        analytics_schema.AudienceInterest(topic="FastAPI", engagement_score=0.6),
    ]

def get_influencers(db: Session, user_id: int, limit: int = 5) -> List[analytics_schema.Influencer]:
    # Mocked: requires complex graph analysis
    return []

def get_analytics_dashboard(db: Session, user_id: int) -> analytics_schema.AnalyticsDashboard:
    return analytics_schema.AnalyticsDashboard(
        engagement_metrics=get_engagement_metrics(db, user_id),
        content_type_performance=get_content_type_performance(db, user_id),
        top_posts=get_top_performing_posts(db, user_id),
        hashtag_performance=get_hashtag_performance(db, user_id),
        follower_analytics=get_follower_analytics(db, user_id),
        follower_activity=get_follower_activity(db, user_id),
        audience_interests=get_audience_interests(db, user_id),
        influencers=get_influencers(db, user_id),
    )
