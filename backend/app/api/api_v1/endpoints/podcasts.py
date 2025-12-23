
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Podcast)
def create_podcast(
    *,
    db: Session = Depends(deps.get_db),
    podcast_in: schemas.PodcastCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Create new podcast.
    """
    podcast = crud.podcast.create_podcast(
        db=db, podcast=podcast_in, creator_id=current_user.id
    )
    return podcast


@router.get("/{podcast_id}", response_model=schemas.Podcast)
def read_podcast(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get podcast by ID.
    """
    podcast = crud.podcast.get_podcast(db=db, podcast_id=podcast_id)
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    return podcast


@router.get("/", response_model=List[schemas.Podcast])
def read_podcasts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Retrieve podcasts.
    """
    podcasts = crud.podcast.get_podcasts(db, skip=skip, limit=limit)
    return podcasts


@router.put("/{podcast_id}", response_model=schemas.Podcast)
def update_podcast(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    podcast_in: schemas.PodcastUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Update a podcast.
    """
    podcast = crud.podcast.get_podcast(db=db, podcast_id=podcast_id)
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    if podcast.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    podcast = crud.podcast.update_podcast(
        db=db, podcast_id=podcast_id, podcast=podcast_in
    )
    return podcast


@router.delete("/{podcast_id}", response_model=schemas.Podcast)
def delete_podcast(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Delete a podcast.
    """
    podcast = crud.podcast.get_podcast(db=db, podcast_id=podcast_id)
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    if podcast.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    podcast = crud.podcast.delete_podcast(db=db, podcast_id=podcast_id)
    return podcast


@router.post("/{podcast_id}/follow", response_model=schemas.PodcastFollower)
def follow_podcast(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Follow a podcast.
    """
    return crud.podcast.follow_podcast(
        db=db, podcast_id=podcast_id, user_id=current_user.id
    )


@router.post("/{podcast_id}/unfollow", response_model=schemas.PodcastFollower)
def unfollow_podcast(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Unfollow a podcast.
    """
    return crud.podcast.unfollow_podcast(
        db=db, podcast_id=podcast_id, user_id=current_user.id
    )


@router.get("/{podcast_id}/followers", response_model=List[schemas.PodcastFollower])
def read_followers(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get followers of a podcast.
    """
    return crud.podcast.get_followers(db=db, podcast_id=podcast_id)


@router.post("/{podcast_id}/recommendations/{recommendation_id}", response_model=schemas.Podcast)
def add_recommendation(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    recommendation_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Add a podcast recommendation.
    """
    podcast = crud.podcast.get_podcast(db=db, podcast_id=podcast_id)
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    if podcast.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.podcast.add_recommendation(
        db=db, podcast_id=podcast_id, recommendation_id=recommendation_id
    )


@router.delete("/{podcast_id}/recommendations/{recommendation_id}", response_model=schemas.Podcast)
def remove_recommendation(
    *,
    db: Session = Depends(deps.get_db),
    podcast_id: int,
    recommendation_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Remove a podcast recommendation.
    """
    podcast = crud.podcast.get_podcast(db=db, podcast_id=podcast_id)
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    if podcast.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return crud.podcast.remove_recommendation(
        db=db, podcast_id=podcast_id, recommendation_id=recommendation_id
    )


@router.get("/{podcast_id}/recommendations", response_model=List[schemas.Podcast])
def read_recommendations(
    *,
    db: Session = Depends(deps.get_gdb),
    podcast_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    """
    Get podcast recommendations.
    """
    return crud.podcast.get_recommended_podcasts(db=db, podcast_id=podcast_id)
