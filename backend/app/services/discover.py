from sqlalchemy.orm import Session
from ..models import User, Room, Post

def search(db: Session, query: str):
    """
    Searches for users, rooms, and posts.
    """
    # In a real application, you would have a more sophisticated search implementation.
    # For example, you might use a full-text search engine like Elasticsearch.
    users = db.query(User).filter(User.username.ilike(f'%{query}%')).all()
    rooms = db.query(Room).filter(Room.name.ilike(f'%{query}%')).all()
    posts = db.query(Post).filter(Post.content.ilike(f'%{query}%')).all()

    results = []
    for user in users:
        results.append({
            "id": user.id,
            "title": user.username,
            "summary": f"User since {user.created_at.strftime('%Y-%m-%d')}",
            "type": "user",
        })
    for room in rooms:
        results.append({
            "id": room.id,
            "title": room.name,
            "summary": f"{room.member_count} members",
            "type": "room",
        })
    for post in posts:
        results.append({
            "id": post.id,
            "title": f"Post by {post.author.username}",
            "summary": post.content[:100],
            "type": "post",
        })

    return results
