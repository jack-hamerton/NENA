from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import analytics as crud_analytics
from app.schemas import analytics as schemas_analytics
from app.api import deps
from app.models import user as user_model

router = APIRouter()

@router.get("/dashboard", response_model=schemas_analytics.AnalyticsDashboard)
def get_analytics_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: user_model.User = Depends(deps.get_current_active_user),
):
    """
    Retrieve a full analytics dashboard for the current user.
    """
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    return crud_analytics.get_analytics_dashboard(db, user_id=current_user.id)
