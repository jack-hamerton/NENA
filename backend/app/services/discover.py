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
                "name": user.username,
                "handle": user.username, 
                "avatar": user.profile_picture_url, 
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
                "content": post.content,
                "author": {
                    "name": post.owner.username,
                    "avatar": post.owner.profile_picture_url
                },
                "type": "post",
            })

    if not type or type == "hashtag":
        hashtags = db.query(Hashtag).filter(Hashtag.text.ilike(f'%{query}%')).all()
        for hashtag in hashtags:
            results.append({
                "id": hashtag.id,
                "name": hashtag.text,
                "postCount": len(hashtag.posts),
                "type": "hashtag",
            })

    return results
