from fastapi_utils.tasks import repeat_every
from sqlalchemy.orm import Session
import random

from app.db.session import SessionLocal
from app.crud.user import user as crud_user
from app.services.notification_service import create_notification

@repeat_every(seconds=60 * 60 * 24)  # Run once a day
def proactive_nudges_task():
    db: Session = SessionLocal()
    try:
        users = crud_user.get_multi(db, skip=0, limit=1000)  # Adjust limit as needed
        for user in users:
            # Analyze user activity to find recurring topics
            topics = {}
            for post in user.posts:
                for word in post.content.lower().split():
                    if len(word) > 5 and word in ["climate", "youth", "campaign", "storytelling", "inclusive", "community", "election", "art", "food"]:
                        topics[word] = topics.get(word, 0) + 1
            
            if topics:
                # Find the user's most frequent topic
                most_frequent_topic = max(topics, key=topics.get)

                # Generate a nudge if the user is highly active on a topic
                if topics[most_frequent_topic] > 5: # If the user has mentioned the topic more than 5 times
                    nudge_type = random.choice(["start_room", "connect_with_user", "explore_topic"])
                    if nudge_type == "start_room":
                        nudge_message = f"You've been very active on the topic of {most_frequent_topic}. Have you considered starting a room about it?"
                    elif nudge_type == "connect_with_user":
                        # Find another user with similar interests
                        similar_users = crud_user.search(db, query=most_frequent_topic)
                        if similar_users and similar_users[0].id != user.id:
                            nudge_message = f"You and {similar_users[0].username} are both passionate about {most_frequent_topic}. Have you considered connecting?"
                        else:
                             nudge_message = f"You're a leading voice on the topic of {most_frequent_topic}. Keep up the great work!"
                    else: # explore_topic
                        nudge_message = f"There's a lot of conversation happening around {most_frequent_topic}. Keep exploring the topic and sharing your voice!"

                    create_notification(db, user_id=user.id, message=nudge_message)
    finally:
        db.close()
