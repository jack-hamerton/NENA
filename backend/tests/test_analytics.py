
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base
from app.models.user import User
from app.models.post import Post
from app.models.trending_audio import TrendingAudio
from app.models.analytics import Analytics, track_views
from app.models.collaboration import Collaboration
from app.models.challenge import Challenge

@pytest.fixture(scope="module")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_track_views(db_session):
    user = User(username="testuser", first_name="test", last_name="user", hashed_password="password")
    db_session.add(user)
    db_session.commit()

    post = Post(content="This is a test post.", author_id=user.id)
    db_session.add(post)
    db_session.commit()

    analytics = db_session.query(Analytics).filter_by(resource_id=post.id).first()
    assert analytics is not None
    assert analytics.views == 1

    # Call track_views again to test view increment
    track_views(Post.__mapper__, db_session.connection(), post)
    db_session.commit()

    db_session.refresh(analytics)
    assert analytics.views == 2
