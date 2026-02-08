
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
