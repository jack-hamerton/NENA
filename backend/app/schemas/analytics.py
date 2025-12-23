
from pydantic import BaseModel
from typing import List, Optional

class UserEngagement(BaseModel):
    user_id: int
    full_name: str
    posts_count: int
    comments_count: int
    following_count: int
    followers_count: int

    class Config:
        orm_mode = True

class PostEngagement(BaseModel):
    post_id: int
    text: str
    author: str
    comments_count: int
    likes_count: int

    class Config:
        orm_mode = True

class EngagementMetrics(BaseModel):
    total_engagements: int
    engagement_rate: float
    impressions: int
    likes: int
    replies: int
    reposts: int
    clicks: int
    follows: int

class ContentTypePerformance(BaseModel):
    content_type: str
    total_posts: int
    average_engagement: float

class TopPost(PostEngagement):
    engagement_rate: float

class HashtagPerformance(BaseModel):
    hashtag: str
    reach: int
    engagement: int

class FollowerAnalytics(BaseModel):
    date: str
    follower_change: int
    total_followers: int

class FollowerActivity(BaseModel):
    hour: int
    activity_level: float

class AudienceInterest(BaseModel):
    topic: str
    engagement_score: float

class Influencer(UserEngagement):
    engagement_with_you: int

class FollowerIntentMetrics(BaseModel):
    supporters: int
    amplifiers: int
    learners: int

class HashtagMetrics(BaseModel):
    tag: str
    count: int

class AnalyticsDashboard(BaseModel):
    engagement_metrics: EngagementMetrics
    content_type_performance: List[ContentTypePerformance]
    top_posts: List[TopPost]
    hashtag_performance: List[HashtagPerformance]
    follower_analytics: List[FollowerAnalytics]
    follower_activity: List[FollowerActivity]
    audience_interests: List[AudienceInterest]
    influencers: List[Influencer]
