
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from uuid import UUID
from app import models, schemas

def get_podcast(db: Session, podcast_id: int):
    return db.query(models.Podcast).options(
        joinedload(models.Podcast.creator),
        joinedload(models.Podcast.episodes).options(
            joinedload(models.Episode.shortcuts),
            joinedload(models.Episode.comments).options(
                joinedload(models.Comment.replies)
            ),
            joinedload(models.Episode.polls).options(
                joinedload(models.Poll.options)
            )
        ),
        joinedload(models.Podcast.followers),
        joinedload(models.Podcast.recommendations)
    ).filter(models.Podcast.id == podcast_id).first()

def get_podcasts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Podcast).options(joinedload(models.Podcast.creator)).offset(skip).limit(limit).all()

def get_top_podcasts(db: Session, type: str, region: str = None):
    if type == "listened":
        order_by_attr = desc(models.Episode.listen_count)
    elif type == "viewed":
        order_by_attr = desc(models.Episode.view_count)
    else:
        return []

    query = db.query(models.Podcast).join(models.Episode)

    if region:
        query = query.filter(models.Podcast.region == region)

    return query.order_by(order_by_attr).limit(10).all()

def create_podcast(db: Session, podcast: schemas.PodcastCreate, creator_id: UUID):
    db_podcast = models.Podcast(**podcast.dict(), creator_id=creator_id)
    db.add(db_podcast)
    db.commit()
    db.refresh(db_podcast)
    return db_podcast

def get_podcasts_by_owner(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Podcast)
        .filter(models.Podcast.creator_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_podcast(db: Session, podcast_id: int, podcast: schemas.PodcastUpdate):
    db_podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()
    if db_podcast:
        for key, value in podcast.dict(exclude_unset=True).items():
            setattr(db_podcast, key, value)
        db.commit()
        db.refresh(db_podcast)
    return db_podcast

def delete_podcast(db: Session, podcast_id: int):
    db_podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()
    if db_podcast:
        db.delete(db_podcast)
        db.commit()
    return db_podcast

def follow_podcast(db: Session, podcast_id: int, user_id: UUID):
    db_follower = models.PodcastFollower(podcast_id=podcast_id, user_id=user_id)
    db.add(db_follower)
    db.commit()
    db.refresh(db_follower)
    return db_follower

def unfollow_podcast(db: Session, podcast_id: int, user_id: UUID):
    db_follower = db.query(models.PodcastFollower).filter(
        models.PodcastFollower.podcast_id == podcast_id,
        models.PodcastFollower.user_id == user_id
    ).first()
    if db_follower:
        db.delete(db_follower)
        db.commit()
    return db_follower

def get_followers(db: Session, podcast_id: int):
    return db.query(models.PodcastFollower).filter(models.PodcastFollower.podcast_id == podcast_id).all()

def add_recommendation(db: Session, podcast_id: int, recommendation_id: int):
    podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()
    recommendation = db.query(models.Podcast).filter(models.Podcast.id == recommendation_id).first()
    if podcast and recommendation:
        podcast.recommendations.append(recommendation)
        db.commit()
        db.refresh(podcast)
    return podcast

def remove_recommendation(db: Session, podcast_id: int, recommendation_id: int):
    podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast_id).first()
    recommendation = db.query(models.Podcast).filter(models.Podcast.id == recommendation_id).first()
    if podcast and recommendation:
        podcast.recommendations.remove(recommendation)
        db.commit()
        db.refresh(podcast)
    return podcast

def get_recommended_podcasts(db: Session, podcast_id: int):
    podcast = db.query(models.Podcast).options(joinedload(models.Podcast.recommendations)).filter(models.Podcast.id == podcast_id).first()
    return podcast.recommendations if podcast else []
