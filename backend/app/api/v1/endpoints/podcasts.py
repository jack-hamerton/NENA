
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from backend.app import schemas, services
from backend.app.core import deps, security
from backend.app.db.models import User

router = APIRouter()


@router.post("/podcasts", response_model=schemas.Podcast)
def create_podcast(
    title: str,
    artist_name: str,
    description: str,
    cover_art: UploadFile = File(...),
    podcast_file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(security.get_current_user),
):
    # In a real application, you would upload the files to a cloud storage
    # and get the URL and s3_key. For this example, we'll use placeholders.
    s3_key = f"podcasts/{podcast_file.filename}"
    cover_art_url = f"covers/{cover_art.filename}"

    podcast_in = schemas.PodcastCreate(
        title=title,
        artist_name=artist_name,
        description=description,
        s3_key=s3_key,
        cover_art_url=cover_art_url,
    )
    return services.podcast_service.create_podcast(
        db=db, podcast_in=podcast_in, creator=current_user
    )


@router.get("/podcasts/{podcast_id}", response_model=schemas.Podcast)
def get_podcast(podcast_id: int, db: Session = Depends(deps.get_db)):
    return services.podcast_service.get_podcast(db, podcast_id)
