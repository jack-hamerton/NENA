
from sqlalchemy.orm import Session
from app.crud.crud_badge import badge as crud_badge
from app.crud.crud_user import user as crud_user
from app.models.user import User
from app.crud.crud_community_room import community_room
from app.crud.crud_room_message import room_message
from app.crud.crud_post import post as crud_post
from app.crud.crud_podcast import get_podcasts_by_owner
from app.crud.crud_episode import get_episodes_for_podcast
from app.crud.crud_reshare import count_reshares_of_new_user_content
from app.crud.crud_challenge import count_completed_challenges
from app.crud.crud_campaign import count_completed_campaigns


# --- Dialogue Builder --- 
# Criteria:
# - Consistently participating in community rooms with respectful, constructive dialogue.
# - Hosting or moderating a room discussion.
# - Contributing to challenges (e.g., storytelling, advocacy campaigns).
def check_and_award_dialogue_builder_badge(db: Session, user: User):
    """
    Awards 'Dialogue Builder' badge.
    """
    badge = crud_badge.get_by_name(db, name="Dialogue Builder")
    if badge and not user_has_badge(user, badge):
        # Check for number of messages sent in community rooms
        message_count = room_message.get_multi_by_owner(db, owner_id=user.id).count()

        if message_count >= 1500:
            user.user_badges.append(badge)


# --- Story Amplifier --- 
# Criteria:
# - Publishing impactful posts that spark conversation.
# - Sharing narratives tied to community themes (#YouthVoices, #ClimateJustice).
# - Receiving meaningful engagement (comments, amplifications, not just likes).
def check_and_award_story_amplifier_badge(db: Session, user: User):
    """
    Awards 'Story Amplifier' badge.
    """
    badge = crud_badge.get_by_name(db, name="Story Amplifier")
    if badge and not user_has_badge(user, badge):
        # Check for number of posts with at least one hashtag
        post_count = crud_post.count_posts_with_hashtags_by_user(db, user_id=user.id)
        if post_count >= 1500:
            user.user_badges.append(badge)


# --- Podcast Creator --- 
# Criteria:
# - Uploading podcasts that highlight local voices or advocacy issues.
# - Reaching a threshold of listens or amplifications.
# - Collaborating with others on joint podcast episodes.
def check_and_award_podcast_creator_badge(db: Session, user: User):
    """
    Awards 'Podcast Creator' badge.
    """
    badge = crud_badge.get_by_name(db, name="Podcast Creator")
    if badge and not user_has_badge(user, badge):
        podcasts = get_podcasts_by_owner(db, user_id=user.id)
        if len(podcasts) >= 5:
            total_listens = 0
            total_views = 0
            for podcast in podcasts:
                episodes = get_episodes_for_podcast(db, podcast_id=podcast.id)
                for episode in episodes:
                    total_listens += episode.listen_count
                    total_views += episode.view_count
            if total_listens >= 10000 and total_views >= 5000:
                user.user_badges.append(badge)

# --- Community Mentor --- 
# Criteria:
# - Following others with intent notes that show genuine support.
# - Mentoring new users or guiding them through onboarding.
# - Amplifying youth voices by resharing or spotlighting their content.
def check_and_award_community_mentor_badge(db: Session, user: User):
    """
    Awards 'Community Mentor' badge.
    """
    badge = crud_badge.get_by_name(db, name="Community Mentor")
    if badge and not user_has_badge(user, badge):
        follower_metrics = crud_user.get_follower_intent_metrics(db, user_id=user.id)
        reshare_count = count_reshares_of_new_user_content(db, user_id=user.id)

        if (
            follower_metrics.get("supporters", 0) >= 50
            and follower_metrics.get("mentors", 0) >= 10
            and reshare_count >= 20
        ):
            user.user_badges.append(badge)

# --- Challenge Contributor --- 
# Criteria:
# - Completing community challenges.
# - Participating in campaigns organized by Nena or local partners.
# - Demonstrating measurable impact.
def check_and_award_challenge_contributor_badge(db: Session, user: User):
    """
    Awards 'Challenge Contributor' badge.
    """
    badge = crud_badge.get_by_name(db, name="Challenge Contributor")
    if badge and not user_has_badge(user, badge):
        completed_challenges = count_completed_challenges(db, user_id=user.id)
        completed_campaigns = count_completed_campaigns(db, user_id=user.id)

        if completed_challenges >= 10 and completed_campaigns >= 100:
            user.user_badges.append(badge)

def user_has_badge(user: User, badge) -> bool:
    for user_badge in user.user_badges:
        if user_badge.badge_id == badge.id:
            return True
    return False
