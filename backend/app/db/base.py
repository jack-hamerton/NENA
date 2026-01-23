
# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.analytics import Analytics
from app.models.badge import Badge
from app.models.calendar import Event, EventParticipant
from app.models.challenge import Challenge
from app.models.collaboration import Collaboration
from app.models.comment import Comment
from app.models.community_room import CommunityRoom, CommunityRoomMessage
from app.models.document import Document
from app.models.feed_poll import FeedPoll
from app.models.follower import Follower
from app.models.hashtag import Hashtag
from app.models.like import Like
from app.models.message import Message
from app.models.notification import Notification
from app.models.podcast import Podcast
from app.models.poll import Poll
from app.models.post import Post
from app.models.profile import Profile
from app.models.quote_post import QuotePost
from app.models.reshare import Reshare
from app.models.room import Room
from app.models.room_message import RoomMessage
from app.models.study import Study, Question, Answer
from app.models.analysis_result import AnalysisResult
from app.models.trending_audio import TrendingAudio
from app.models.user import User
