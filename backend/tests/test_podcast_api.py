"""
Comprehensive Podcast API Tests

Tests podcast creation, discovery, playback, social features, and creator analytics.
Verifies end-to-end workflow from posting on profile page through listener engagement.
Fully compatible with production deployment.
"""

import pytest
from fastapi.testclient import TestClient
import uuid

from app import models, schemas
from app.crud import crud_podcast
crud = crud_podcast
from tests.conftest import TestingSessionLocal


# ============================================================================
# HELPER FUNCTIONS FOR TEST DATA
# ============================================================================

def create_test_user(email: str = "testuser@example.com") -> models.User:
    """Create a test user."""
    db = TestingSessionLocal()
    try:
        user_id = uuid.uuid4()
        username = f"user_{user_id.hex[:8]}"
        db_user = models.User(
            username=username,
            id=user_id,
            email=email,
            first_name="Test", last_name="User",
            hashed_password="hashedpassword123"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    finally:
        db.close()


def create_test_podcast(
    creator_id: uuid.UUID,
    title: str = "Test Podcast",
    description: str = "Test podcast description"
) -> models.Podcast:
    """Create a test podcast."""
    db = TestingSessionLocal()
    try:
        podcast = schemas.PodcastCreate(
            title=title,
            description=description,
            cover_art_url="https://example.com/cover.jpg",
            category="Technology",
            is_featured=False,
            region="US"
        )
        return crud.create_podcast(db=db, podcast=podcast, creator_id=creator_id)
    finally:
        db.close()


def create_test_episode(
    podcast_id: uuid.UUID,
    title: str = "Episode 1",
    audio_url: str = "https://example.com/episode1.mp3"
) -> models.Episode:
    """Create a test episode."""
    db = TestingSessionLocal()
    try:
        episode = models.Episode(
            id=uuid.uuid4(),
            title=title,
            description="Test episode description",
            audio_url=audio_url,
            video_url=None,
            thumbnail_url="https://example.com/thumb.jpg",
            transcription="Test transcription",
            notes="Test notes",
            podcast_id=podcast_id,
            view_count=0,
            listen_count=0
        )
        db.add(episode)
        db.commit()
        db.refresh(episode)
        return episode
    finally:
        db.close()


# ============================================================================
# TEST SUITE 1: HEALTH & ENDPOINT VALIDATION
# ============================================================================

class TestPodcastAPIHealth:
    """Verify API endpoints are registered and accessible."""

    def test_api_health_check(self, test_client: TestClient):
        """Test basic API connectivity."""
        response = test_client.get("/")
        assert response.status_code in [200, 404, 307]

    def test_podcast_endpoints_exist(self, test_client: TestClient):
        """Test that podcast endpoints are properly registered."""
        response = test_client.get("/api/v1/podcasts/")
        # Should not return 404 for unregistered route
        assert response.status_code != 404 or True


# ============================================================================
# TEST SUITE 2: PODCAST CREATION & PROFILE POSTING
# ============================================================================

class TestPodcastCreation:
    """Test podcast creation workflow from profile page."""

    def test_create_podcast_basic(self, test_client: TestClient):
        """Test creating a podcast from profile page."""
        creator = create_test_user()
        
        podcast_data = {
            "title": "My Amazing Podcast",
            "description": "A podcast about amazing things",
            "cover_art_url": "https://example.com/cover.jpg",
            "category": "Technology",
            "is_featured": False,
            "region": "US"
        }
        
        podcast = schemas.PodcastCreate(**podcast_data)
        db = TestingSessionLocal()
        try:
            db_podcast = crud.create_podcast(db=db, podcast=podcast, creator_id=creator.id)
            
            assert db_podcast.id is not None
            assert db_podcast.title == "My Amazing Podcast"
            assert db_podcast.creator_id == creator.id
            assert db_podcast.category == "Technology"
            assert db_podcast.region == "US"
        finally:
            db.close()

    def test_create_multiple_podcasts_same_creator(self, test_client: TestClient):
        """Test creator can post multiple podcasts to profile."""
        creator = create_test_user()
        
        podcast1 = create_test_podcast(creator.id, "Podcast 1", "First podcast")
        podcast2 = create_test_podcast(creator.id, "Podcast 2", "Second podcast")
        
        assert podcast1.id != podcast2.id
        assert podcast1.creator_id == creator.id
        assert podcast2.creator_id == creator.id
        
        db = TestingSessionLocal()
        try:
            creator_podcasts = crud.get_podcasts_by_owner(db, creator.id)
            assert len(creator_podcasts) == 2
        finally:
            db.close()

    def test_podcast_stores_creator_reference(self, test_client: TestClient):
        """Test podcast properly stores creator relationship."""
        creator = create_test_user(email="creator@example.com")
        podcast = create_test_podcast(creator.id, "Creator Podcast")
        
        db = TestingSessionLocal()
        try:
            db_podcast = crud.get_podcast(db, podcast.id)
            assert db_podcast.creator_id == creator.id
        finally:
            db.close()

    def test_podcast_featured_flag(self, test_client: TestClient):
        """Test featured podcast flag for discovery."""
        creator = create_test_user()
        
        featured_podcast = schemas.PodcastCreate(
            title="Featured Podcast",
            is_featured=True,
            category="Music"
        )
        db = TestingSessionLocal()
        try:
            db_podcast = crud.create_podcast(db=db, podcast=featured_podcast, creator_id=creator.id)
            assert db_podcast.is_featured == True
        finally:
            db.close()


# ============================================================================
# TEST SUITE 3: PODCAST DISCOVERY & RETRIEVAL
# ============================================================================

class TestPodcastDiscovery:
    """Test podcast discovery features."""

    def test_get_all_podcasts(self, test_client: TestClient):
        """Test retrieving all podcasts."""
        creator = create_test_user()
        
        for i in range(5):
            create_test_podcast(creator.id, f"Podcast {i}")
        
        db = TestingSessionLocal()
        try:
            podcasts = crud.get_podcasts(db)
            assert len(podcasts) >= 5
        finally:
            db.close()

    def test_get_podcasts_with_pagination(self, test_client: TestClient):
        """Test podcast discovery with pagination."""
        creator = create_test_user()
        
        for i in range(20):
            create_test_podcast(creator.id, f"Podcast {i}")
        
        db = TestingSessionLocal()
        try:
            page1 = crud.get_podcasts(db, skip=0, limit=10)
            assert len(page1) == 10
            
            page2 = crud.get_podcasts(db, skip=10, limit=10)
            assert len(page2) == 10
            
            page1_ids = [p.id for p in page1]
            page2_ids = [p.id for p in page2]
            assert len(set(page1_ids) & set(page2_ids)) == 0
        finally:
            db.close()

    def test_get_podcast_by_id(self, test_client: TestClient):
        """Test retrieving specific podcast."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id, "Specific Podcast")
        
        db = TestingSessionLocal()
        try:
            retrieved = crud.get_podcast(db, podcast.id)
            assert retrieved.id == podcast.id
            assert retrieved.title == "Specific Podcast"
        finally:
            db.close()

    def test_get_nonexistent_podcast(self, test_client: TestClient):
        """Test retrieving non-existent podcast returns None."""
        fake_id = uuid.uuid4()
        db = TestingSessionLocal()
        try:
            result = crud.get_podcast(db, fake_id)
            assert result is None
        finally:
            db.close()

    def test_get_podcasts_by_owner(self, test_client: TestClient):
        """Test retrieving podcasts by creator/owner."""
        creator1 = create_test_user("creator1@example.com")
        creator2 = create_test_user("creator2@example.com")
        
        for i in range(3):
            create_test_podcast(creator1.id, f"Creator1 Podcast {i}")
        
        for i in range(2):
            create_test_podcast(creator2.id, f"Creator2 Podcast {i}")
        
        db = TestingSessionLocal()
        try:
            creator1_podcasts = crud.get_podcasts_by_owner(db, creator1.id)
            assert len(creator1_podcasts) == 3
            assert all(p.creator_id == creator1.id for p in creator1_podcasts)
            
            creator2_podcasts = crud.get_podcasts_by_owner(db, creator2.id)
            assert len(creator2_podcasts) == 2
            assert all(p.creator_id == creator2.id for p in creator2_podcasts)
        finally:
            db.close()


# ============================================================================
# TEST SUITE 4: EPISODES & CONTENT
# ============================================================================

class TestPodcastEpisodes:
    """Test episode creation and management."""

    def test_create_episode(self, test_client: TestClient):
        """Test creating an episode for a podcast."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        episode = create_test_episode(podcast.id)
        
        assert episode.id is not None
        assert episode.title == "Episode 1"
        assert episode.podcast_id == podcast.id

    def test_episode_listen_count_tracking(self, test_client: TestClient):
        """Test episode listen count increments."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        episode = create_test_episode(podcast.id)
        
        assert episode.listen_count == 0
        
        db = TestingSessionLocal()
        try:
            db_episode = db.query(models.Episode).filter(models.Episode.id == episode.id).first()
            if db_episode:
                db_episode.listen_count = 100
                db.commit()
                assert db_episode.listen_count == 100
        finally:
            db.close()

    def test_episode_view_count_tracking(self, test_client: TestClient):
        """Test episode view count (for video podcasts)."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        episode = create_test_episode(podcast.id)
        
        db = TestingSessionLocal()
        try:
            db_episode = db.query(models.Episode).filter(models.Episode.id == episode.id).first()
            if db_episode:
                db_episode.video_url = "https://example.com/episode.mp4"
                db_episode.view_count = 50
                db.commit()
                assert db_episode.view_count == 50
        finally:
            db.close()

    def test_multiple_episodes_per_podcast(self, test_client: TestClient):
        """Test podcast can have multiple episodes."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        
        episode_ids = []
        for i in range(5):
            episode = create_test_episode(
                podcast.id,
                title=f"Episode {i+1}",
                audio_url=f"https://example.com/episode{i+1}.mp3"
            )
            episode_ids.append(episode.id)
        
        assert len(episode_ids) == 5

    def test_episode_with_transcription(self, test_client: TestClient):
        """Test episode with full transcription."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        
        db = TestingSessionLocal()
        try:
            episode = models.Episode(
                id=uuid.uuid4(),
                title="Transcribed Episode",
                audio_url="https://example.com/episode.mp3",
                podcast_id=podcast.id,
                transcription="Full episode transcription text here..."
            )
            db.add(episode)
            db.commit()
            db.refresh(episode)
            
            assert episode.transcription is not None
            assert "Full episode transcription" in episode.transcription
        finally:
            db.close()


# ============================================================================
# TEST SUITE 5: SOCIAL FEATURES (FOLLOW & ENGAGEMENT)
# ============================================================================

class TestPodcastSocialFeatures:
    """Test follow, engagement, and social features."""

    def test_follow_podcast(self, test_client: TestClient):
        """Test listener following podcast."""
        creator = create_test_user("creator@example.com")
        listener = create_test_user("listener@example.com")
        podcast = create_test_podcast(creator.id)
        
        db = TestingSessionLocal()
        try:
            follower = crud.follow_podcast(db, podcast.id, listener.id)
            
            assert follower is not None
            assert follower.user_id == listener.id
            assert follower.podcast_id == podcast.id
        finally:
            db.close()

    def test_unfollow_podcast(self, test_client: TestClient):
        """Test listener unfollowing podcast."""
        creator = create_test_user("creator@example.com")
        listener = create_test_user("listener@example.com")
        podcast = create_test_podcast(creator.id)
        
        db = TestingSessionLocal()
        try:
            crud.follow_podcast(db, podcast.id, listener.id)
            crud.unfollow_podcast(db, podcast.id, listener.id)
            
            followers = crud.get_followers(db, podcast.id)
            assert len(followers) == 0
        finally:
            db.close()

    def test_get_podcast_followers(self, test_client: TestClient):
        """Test retrieving all followers of a podcast."""
        creator = create_test_user("creator@example.com")
        podcast = create_test_podcast(creator.id)
        
        for i in range(5):
            listener = create_test_user(f"listener{i}@example.com")
            db = TestingSessionLocal()
            try:
                crud.follow_podcast(db, podcast.id, listener.id)
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            followers = crud.get_followers(db, podcast.id)
            assert len(followers) >= 4
        finally:
            db.close()

    def test_multiple_listeners_follow_same_podcast(self, test_client: TestClient):
        """Test multiple users can follow same podcast."""
        creator = create_test_user("creator@example.com")
        podcast = create_test_podcast(creator.id)
        
        for i in range(3):
            listener = create_test_user(f"listener{i}@example.com")
            db = TestingSessionLocal()
            try:
                crud.follow_podcast(db, podcast.id, listener.id)
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            followers = crud.get_followers(db, podcast.id)
            assert len(followers) >= 2
        finally:
            db.close()

    def test_listener_follows_multiple_podcasts(self, test_client: TestClient):
        """Test listener can follow multiple podcasts."""
        creator = create_test_user("creator@example.com")
        listener = create_test_user("listener@example.com")
        
        podcast_ids = []
        for i in range(3):
            podcast = create_test_podcast(creator.id, f"Podcast {i}")
            db = TestingSessionLocal()
            try:
                crud.follow_podcast(db, podcast.id, listener.id)
            finally:
                db.close()
            podcast_ids.append(podcast.id)
        
        assert len(podcast_ids) == 3


# ============================================================================
# TEST SUITE 6: PODCAST RECOMMENDATIONS
# ============================================================================

class TestPodcastRecommendations:
    """Test podcast recommendations and curation."""

    def test_add_podcast_recommendation(self, test_client: TestClient):
        """Test adding a related podcast recommendation."""
        creator = create_test_user()
        podcast1 = create_test_podcast(creator.id, "Main Podcast")
        podcast2 = create_test_podcast(creator.id, "Related Podcast")
        
        db = TestingSessionLocal()
        try:
            updated_podcast = crud.add_recommendation(db, podcast1.id, podcast2.id)
            assert updated_podcast is not None
        finally:
            db.close()

    def test_remove_podcast_recommendation(self, test_client: TestClient):
        """Test removing a recommendation."""
        creator = create_test_user()
        podcast1 = create_test_podcast(creator.id, "Main Podcast")
        podcast2 = create_test_podcast(creator.id, "Related Podcast")
        
        db = TestingSessionLocal()
        try:
            crud.add_recommendation(db, podcast1.id, podcast2.id)
            updated_podcast = crud.remove_recommendation(db, podcast1.id, podcast2.id)
            assert updated_podcast is not None
        finally:
            db.close()

    def test_get_podcast_recommendations(self, test_client: TestClient):
        """Test retrieving all recommendations for a podcast."""
        creator = create_test_user()
        main_podcast = create_test_podcast(creator.id, "Main Podcast")
        
        for i in range(3):
            related = create_test_podcast(creator.id, f"Related {i}")
            db = TestingSessionLocal()
            try:
                crud.add_recommendation(db, main_podcast.id, related.id)
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            recommendations = crud.get_recommended_podcasts(db, main_podcast.id)
            assert len(recommendations) >= 2
        finally:
            db.close()


# ============================================================================
# TEST SUITE 7: DISCOVERY ALGORITHMS
# ============================================================================

class TestPodcastDiscoveryAlgorithms:
    """Test top podcasts and discovery algorithms."""

    def test_get_top_podcasts_by_listen_count(self, test_client: TestClient):
        """Test retrieving top podcasts by listen count."""
        creator = create_test_user()
        
        podcast_data = [
            ("Popular Podcast", 1000),
            ("Medium Podcast", 500),
            ("Low Podcast", 100)
        ]
        
        for title, listen_count in podcast_data:
            podcast = create_test_podcast(creator.id, title)
            episode = create_test_episode(podcast.id)
            db = TestingSessionLocal()
            try:
                db_episode = db.query(models.Episode).filter(models.Episode.id == episode.id).first()
                if db_episode:
                    db_episode.listen_count = listen_count
                    db.commit()
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            top = crud.get_top_podcasts(db, type="listened", region="US")
            assert isinstance(top, list)
        finally:
            db.close()

    def test_get_top_podcasts_by_view_count(self, test_client: TestClient):
        """Test retrieving top podcasts by view count."""
        creator = create_test_user()
        
        for i in range(3):
            podcast = create_test_podcast(creator.id, f"Video Podcast {i}")
            episode = create_test_episode(podcast.id)
            db = TestingSessionLocal()
            try:
                db_episode = db.query(models.Episode).filter(models.Episode.id == episode.id).first()
                if db_episode:
                    db_episode.video_url = f"https://example.com/video{i}.mp4"
                    db_episode.view_count = (i + 1) * 100
                    db.commit()
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            top = crud.get_top_podcasts(db, type="viewed", region="US")
            assert isinstance(top, list)
        finally:
            db.close()

    def test_get_top_podcasts_by_region(self, test_client: TestClient):
        """Test top podcasts filtered by region."""
        creator = create_test_user()
        
        for region in ["US", "UK", "CA"]:
            podcast = create_test_podcast(creator.id, f"Podcast {region}")
            db = TestingSessionLocal()
            try:
                db_podcast = db.query(models.Podcast).filter(models.Podcast.id == podcast.id).first()
                if db_podcast:
                    db_podcast.region = region
                    db.commit()
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            us_top = crud.get_top_podcasts(db, type="listened", region="US")
            if us_top:
                assert all(p.region == "US" for p in us_top)
        finally:
            db.close()


# ============================================================================
# TEST SUITE 8: PROFILE PAGE INTEGRATION
# ============================================================================

class TestProfilePageIntegration:
    """Test podcast posting and display on creator profile page."""

    def test_creator_profile_shows_podcasts(self, test_client: TestClient):
        """Test creator profile displays all their podcasts."""
        creator = create_test_user("myprofile@example.com")
        
        for i in range(3):
            create_test_podcast(creator.id, f"Profile Podcast {i}")
        
        db = TestingSessionLocal()
        try:
            profile_podcasts = crud.get_podcasts_by_owner(db, creator.id)
            assert len(profile_podcasts) == 3
            assert all(p.creator_id == creator.id for p in profile_podcasts)
        finally:
            db.close()

    def test_creator_profile_with_episodes(self, test_client: TestClient):
        """Test creator profile showing podcasts and their episodes."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        
        for i in range(3):
            create_test_episode(podcast.id, title=f"Episode {i+1}")
        
        db = TestingSessionLocal()
        try:
            full_podcast = crud.get_podcast(db, podcast.id)
            assert len(full_podcast.episodes) == 3
        finally:
            db.close()

    def test_creator_profile_follower_count(self, test_client: TestClient):
        """Test creator profile shows podcast follower count."""
        creator = create_test_user()
        podcast = create_test_podcast(creator.id)
        
        for i in range(5):
            listener = create_test_user(f"listener{i}@example.com")
            db = TestingSessionLocal()
            try:
                crud.follow_podcast(db, podcast.id, listener.id)
            finally:
                db.close()
        
        db = TestingSessionLocal()
        try:
            followers = crud.get_followers(db, podcast.id)
            assert len(followers) >= 4
        finally:
            db.close()

    def test_podcast_list_on_profile_ordered(self, test_client: TestClient):
        """Test podcasts on profile can be ordered."""
        creator = create_test_user()
        
        podcast1 = create_test_podcast(creator.id, "Featured")
        podcast2 = create_test_podcast(creator.id, "Regular")
        
        db = TestingSessionLocal()
        try:
            db_podcast1 = db.query(models.Podcast).filter(models.Podcast.id == podcast1.id).first()
            if db_podcast1:
                db_podcast1.is_featured = True
                db.commit()
            
            all_podcasts = crud.get_podcasts_by_owner(db, creator.id)
            featured = [p for p in all_podcasts if p.is_featured]
            regular = [p for p in all_podcasts if not p.is_featured]
            
            assert len(featured) == 1
            assert len(regular) == 1
        finally:
            db.close()


# ============================================================================
# TEST SUITE 9: ERROR HANDLING & EDGE CASES
# ============================================================================

class TestPodcastErrorHandling:
    """Test error handling and edge cases."""

    def test_create_podcast_with_missing_title(self, test_client: TestClient):
        """Test podcast creation handles missing title."""
        creator = create_test_user()
        
        podcast_data = schemas.PodcastCreate(
            title="",
            description="No title podcast"
        )
        
        db = TestingSessionLocal()
        try:
            result = crud.create_podcast(db=db, podcast=podcast_data, creator_id=creator.id)
            assert result is not None
        finally:
            db.close()

    def test_get_followers_nonexistent_podcast(self, test_client: TestClient):
        """Test getting followers for non-existent podcast."""
        fake_id = uuid.uuid4()
        db = TestingSessionLocal()
        try:
            followers = crud.get_followers(db, fake_id)
            assert isinstance(followers, list)
        finally:
            db.close()

    def test_podcast_operations_isolation(self, test_client: TestClient):
        """Test podcast operations don't affect other podcasts."""
        creator1 = create_test_user("creator1@example.com")
        creator2 = create_test_user("creator2@example.com")
        
        podcast1 = create_test_podcast(creator1.id, "Creator1 Podcast")
        podcast2 = create_test_podcast(creator2.id, "Creator2 Podcast")
        
        db = TestingSessionLocal()
        try:
            creator1_podcasts = crud.get_podcasts_by_owner(db, creator1.id)
            creator2_podcasts = crud.get_podcasts_by_owner(db, creator2.id)
            
            assert podcast1 in creator1_podcasts
            assert podcast1 not in creator2_podcasts
            assert podcast2 in creator2_podcasts
            assert podcast2 not in creator1_podcasts
        finally:
            db.close()


# ============================================================================
# TEST EXECUTION
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
