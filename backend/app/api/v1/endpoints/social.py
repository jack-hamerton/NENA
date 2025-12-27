from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.follower import Follower
from app.schemas.follower import FollowerCreate
from app.services.notification import NotificationService
from app.schemas.notification import NotificationCreate

router = APIRouter()
notification_service = NotificationService()


@router.post("/follow")
def follow_user(
    follower_data: FollowerCreate,
    db: Session = Depends(deps.get_db),
):
    """
    Follow a user.
    """
    follower_user = db.query(User).filter(User.id == follower_data.follower_id).first()
    followed_user = db.query(User).filter(User.id == follower_data.followed_id).first()

    if not follower_user or not followed_user:
        raise HTTPException(status_code=404, detail="User not found")

    if follower_user.id == followed_user.id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    existing_follow = (
        db.query(Follower)
        .filter(
            Follower.follower_id == follower_user.id,
            Follower.followed_id == followed_user.id,
        )
        .first()
    )

    if existing_follow:
        raise HTTPException(status_code=400, detail="You are already following this user")

    follow = Follower(follower_id=follower_user.id, followed_id=followed_user.id, intent=follower_data.intent)
    db.add(follow)
    db.commit()

    # Create a notification for the followed user
    notification_in = NotificationCreate(
        user_id=followed_user.id,
        type="new_follower",
        content=f"{follower_user.username} started following you as a {follower_data.intent}.",
    )
    notification_service.create_notification(db=db, notification_in=notification_in)

    return {"message": "Successfully followed user"}
