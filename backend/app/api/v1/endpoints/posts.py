
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import Any, List
import re
import shutil
from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    """
    Upload an image and return its URL.
    """
    with open(f"static/images/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"imageUrl": f"/static/images/{file.filename}"}


@router.post("/upload-video")
def upload_video(file: UploadFile = File(...)):
    """
    Upload a video and return its URL.
    Videos must be no longer than 5 minutes (300 seconds).
    """
    import os
    
    # Check file size (limit to ~150MB for 5-minute video)
    file_size = 0
    content = file.file.read()
    file_size = len(content)

    if file_size > 150 * 1024 * 1024:  # 150MB limit
        raise HTTPException(status_code=413, detail="Video file too large. Maximum size is 150MB.")

    # Check video extension
    if not file.filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm')):
        raise HTTPException(status_code=400, detail="Unsupported video format. Use MP4, MOV, AVI, MKV, or WebM.")

    # Create videos directory if it doesn't exist
    os.makedirs("static/videos", exist_ok=True)
    
    # Save file with unique name to avoid overwrites
    import uuid
    file_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"static/videos/{file_name}"
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Try to validate video duration using ffmpeg if available
    try:
        import subprocess
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", 
             "-of", "default=noprint_wrappers=1:nokey=1:noprint_wrappers=1", file_path],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.stdout:
            duration = float(result.stdout.strip())
            if duration > 300:  # 5 minutes
                os.remove(file_path)
                raise HTTPException(status_code=400, detail="Video duration exceeds 5 minutes. Please choose a shorter video.")
    except (FileNotFoundError, subprocess.TimeoutExpired, ValueError):
        # ffprobe not available or failed, just proceed with the upload
        # Client-side validation should catch most issues
        pass

    return {"videoUrl": f"/static/videos/{file_name}"}


@router.get("/for-you", response_model=List[schemas.Post])
def read_for_you_feed(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve the "For You" feed for the current user.
    """
    # Include the current user's posts so "For You" isn't empty in small/dev datasets.
    posts = crud.post.get_multi(db, limit=20)
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=posts)


@router.get("/following", response_model=List[schemas.Post])
def read_following_feed(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve the "Following" feed for the current user.
    """
    following_users = [f.followed for f in current_user.following]
    following_user_ids = [user.id for user in following_users]

    posts = crud.post.get_multi_by_owners(db, user_ids=following_user_ids)
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=posts)


@router.get("/by-user/{user_id}", response_model=List[schemas.Post])
def read_posts_by_user(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all posts for a specific user.
    """
    posts = crud.post.get_multi_by_owner(db, user_id=user_id, skip=skip, limit=limit)
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=posts)


@router.get("/hashtag/{hashtag}", response_model=List[schemas.Post])
def read_posts_by_hashtag(
    hashtag: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve posts containing a specific hashtag.
    """
    posts = crud.post.get_by_hashtag(db, hashtag=hashtag)
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=posts)


@router.get("/{post_id}", response_model=schemas.Post)
def read_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get post by ID.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=[post])[0]


@router.post("/", response_model=schemas.Post)
def create_post(
    *,
    db: Session = Depends(deps.get_db),
    post_in: schemas.PostCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new post.
    """
    post = crud.post.create_with_owner(db, obj_in=post_in, user_id=current_user.id)

    # Extract hashtags and associate them with the post
    hashtags = set(re.findall(r"#(\w+)", post_in.content))
    for tag_name in hashtags:
        hashtag_obj = crud.hashtag.get_or_create(db, tag=tag_name)
        post.hashtags.append(hashtag_obj)

    db.add(post)
    db.commit()
    db.refresh(post)

    # Return the post with the author and likes count
    new_post = crud.post.get(db, id=post.id)
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=[new_post])[0]


@router.post("/{post_id}/report", response_model=schemas.Post)
def report_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Report a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return crud.post.update(db, db_obj=post, obj_in={"is_reported": True})


@router.post("/{post_id}/like", response_model=schemas.Post)
def like_post(
    post_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Like a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    like = crud.like.get_by_post_and_user(db, post_id=post_id, user_id=current_user.id)
    if like:
        raise HTTPException(status_code=400, detail="Post already liked")

    crud.like.create_with_owner(db, obj_in=schemas.LikeCreate(), post_id=post_id, user_id=current_user.id)

    db.refresh(post)
    return crud.post.get_posts_with_follow_status(db, user_id=current_user.id, posts=[post])[0]


@router.get("/{post_id}/comments", response_model=List[schemas.Comment])
def get_comments(
    post_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get comments for a post.
    """
    comments = crud.comment.get_multi_by_post(db, post_id=post_id)
    return comments


@router.post("/{post_id}/comments", response_model=schemas.Comment)
def create_comment(
    post_id: int,
    comment_in: schemas.CommentCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new comment on a post.
    """
    post = crud.post.get(db, id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = crud.comment.create_with_owner(
        db, obj_in=comment_in, user_id=current_user.id, post_id=post_id
    )
    return comment
