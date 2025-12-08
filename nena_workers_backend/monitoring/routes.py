
from fastapi import APIRouter

router = APIRouter()

@router.get("/app-status")
def get_app_status():
    # In a real application, we would check the status of the main app
    return {"status": "ok"}
