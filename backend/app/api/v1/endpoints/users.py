
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app import schemas, services
from backend.app.core import deps

router = APIRouter()


@router.get("/{user_id}/podcasts", response_model=list[schemas.Podcast])
def get_user_podcasts(user_id: int, db: Session = Depends(deps.get_db)):
    return services.user_service.get_user_podcasts(db, user_id)
