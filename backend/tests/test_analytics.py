
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base, get_engine, get_session_local
from app.models.user import User
from app.models.post import Post
from app.models.podcast import Episode
from app.models.trending_audio import TrendingAudio
from app.models.analytics import Analytics, track_views

@pytest.fixture(scope="module")
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Monkeypatch the database engine and session local for the test session
    def override_get_engine():
        return engine

    def override_get_session_local():
        return session

    get_engine = override_get_engine
    get_session_local = override_get_session_local

    yield session
    session.close()

def test_track_views(db_session):
    user = User(username="testuser", hashed_password="password")
    db_session.add(user)
    db_session.commit()

    post = Post(title="Test Post", content="This is a test post.", owner_id=user.id)
    db_session.add(post)
    db_session.commit()

    track_views(None, None, post)

    analytics = db_session.query(Analytics).filter_by(resource_id=post.id).first()
    assert analytics is not None
    assert analytics.views == 1
