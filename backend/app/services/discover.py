from sqlalchemy.orm import Session
from ..models import User, Room, Post, Hashtag

def search(db: Session, query: str, type: str = None):
    """
    Searches for users, rooms, posts, and hashtags.
    """
    results = []

    if not type or type == "user":
        users = db.query(User).filter(User.username.ilike(f'%{query}%')).all()
        for user in users:
            results.append({
                "id": user.id,
                "title": user.username,
                "summary": f"User since {user.created_at.strftime('%Y-%m-%d')}",
                "type": "user",
            })

    if not type or type == "room":
        rooms = db.query(Room).filter(Room.name.ilike(f'%{query}%')).all()
        for room in rooms:
            results.append({
                "id": room.id,
                "title": room.name,
                "summary": f"{room.member_count} members",
                "type": "room",
            })

    if not type or type == "post":
        posts = db.query(Post).filter(Post.content.ilike(f'%{query}%')).all()
        for post in posts:
            results.append({
                "id": post.id,
                "title": f"Post by {post.owner.username}",
                "summary": post.content[:100],
                "type": "post",
            })

    if not type or type == "hashtag":
        hashtags = db.query(Hashtag).filter(Hashtag.text.ilike(f'%{query}%')).all()
        for hashtag in hashtags:
            results.append({
                "id": hashtag.id,
                "title": f"#{hashtag.text}",
                "summary": f"{len(hashtag.posts)} posts",
                "type": "hashtag",
            })

    return results
