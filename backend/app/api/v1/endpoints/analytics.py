from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_data():
    """
    Returns a summary of analytics data for the dashboard.
    """
    # In a real application, you would fetch this data from a database or a real analytics service.
    # For now, we will return some mock data.
    return {
        "users": {"total": 120, "new": 5},
        "posts": {"total": 560, "today": 12},
        "rooms": {"total": 34, "active": 15},
        "active_users": 78,
    }
