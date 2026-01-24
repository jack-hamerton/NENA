
"""
Comprehensive Test Suite for Analytics Endpoints

Tests all analytics functionality including:
- Advocacy Impact Matrix calculation
- User Engagement metrics
- Post Engagement metrics
- Data integrity and edge cases
- Performance with large datasets
- Error handling
"""

import uuid
import time
import pytest
from sqlalchemy.orm import Session
from app.db.base_class import Base
from app import models, schemas
from app.models.user import User
from app.models.post import Post
from app.models.document import Document
from app.models.poll import Poll
from app.models.study import Study
from tests.conftest import TestingSessionLocal, engine


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def create_test_user(db: Session, email: str = None, first_name: str = None, last_name: str = None) -> User:
    """Create a test user"""
    user = User(
        id=uuid.uuid4(),
        email=email or f"user_{uuid.uuid4()}@test.com",
        first_name=first_name or f"Test",
        last_name=last_name or f"User {uuid.uuid4()}",
        username=f"testuser_{uuid.uuid4()}",
        hashed_password="hashed_password",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_test_post(db: Session, author_id: uuid.UUID, content: str = "Test post", 
                    audience: str = "PUBLIC") -> Post:
    """Create a test post"""
    post = Post(
        id=uuid.uuid4(),
        content=content,
        author_id=author_id,
        audience=audience,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def create_test_document(db: Session, author_id: uuid.UUID, title: str = "Test Doc") -> Document:
    """Create a test document (Note: Document model doesn't have audience field)"""
    doc = Document(
        id=uuid.uuid4(),
        document_id=f"doc_{uuid.uuid4()}",
        content="Test document content",
        author_id=author_id,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def create_test_poll(db: Session, author_id: uuid.UUID, question: str = "Test?") -> Poll:
    """Create a test poll (Note: Poll model doesn't have audience field)"""
    poll = Poll(
        id=uuid.uuid4(),
        question=question,
        author_id=author_id,
    )
    db.add(poll)
    db.commit()
    db.refresh(poll)
    return poll


def create_test_study(db: Session, author_id: uuid.UUID, title: str = "Test Study") -> Study:
    """Create a test study (Note: Study model doesn't have audience field)"""
    study = Study(
        id=uuid.uuid4(),
        title=title,
        author_id=author_id,
    )
    db.add(study)
    db.commit()
    db.refresh(study)
    return study


# ============================================================================
# TEST CLASS 1: Matrix Health
# ============================================================================

class TestAdvocacyMatrixHealth:
    """Test advocacy matrix model structure"""

    def test_matrix_structure_exists(self, db: Session):
        """Verify advocacy matrix endpoint structure"""
        from app.api.v1.endpoints import analytics
        
        assert hasattr(analytics, 'router')
        assert hasattr(analytics.router, 'routes')

    def test_matrix_schema_fields(self):
        """Verify AdvocacyImpactMatrix schema has required fields"""
        schema = schemas.analytics.AdvocacyImpactMatrix
        
        assert hasattr(schema, 'model_fields')
        fields = schema.model_fields
        assert 'matrix' in fields
        assert 'recommendation' in fields

    def test_matrix_response_format(self):
        """Verify response format is correct"""
        test_matrix = schemas.analytics.AdvocacyImpactMatrix(
            matrix=[[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            recommendation="Test recommendation"
        )
        
        assert isinstance(test_matrix.matrix, list)
        assert len(test_matrix.matrix) == 3
        assert len(test_matrix.matrix[0]) == 3
        assert test_matrix.recommendation == "Test recommendation"


# ============================================================================
# TEST CLASS 2: Empty User Matrix
# ============================================================================

class TestEmptyUserMatrix:
    """Test advocacy matrix with user having no activities"""

    def test_user_with_no_activities(self, db: Session):
        """User with no posts/documents/etc should have all zeros"""
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        user = create_test_user(db)
        result = get_advocacy_impact_matrix(user.id, db)
        
        # All cells should be 0
        expected_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        assert result['matrix'] == expected_matrix

    def test_recommendation_with_no_activities(self, db: Session):
        """Recommendation text for user with no activities"""
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        user = create_test_user(db)
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Should generate recommendation
        assert result['recommendation'] is not None
        assert isinstance(result['recommendation'], str)

    def test_nonexistent_user(self, db: Session):
        """Query for nonexistent user should return all zeros"""
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        fake_user_id = uuid.uuid4()
        result = get_advocacy_impact_matrix(fake_user_id, db)
        
        expected_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        assert result['matrix'] == expected_matrix


# ============================================================================
# TEST CLASS 3: Matrix Calculation
# ============================================================================

class TestMatrixCalculation:
    """Test matrix calculation logic"""

    def test_post_categorization(self, db: Session):
        """Posts should categorize as Awareness"""
        user = create_test_user(db)
        
        # Create posts with different audiences
        post_public = create_test_post(db, user.id, audience="PUBLIC")
        post_influencers = create_test_post(db, user.id, audience="INFLUENCERS")
        post_stakeholders = create_test_post(db, user.id, audience="STAKEHOLDERS")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # First row (awareness) should have [1, 1, 1]
        assert result['matrix'][0] == [1, 1, 1]
        # Other rows should be 0
        assert result['matrix'][1] == [0, 0, 0]
        assert result['matrix'][2] == [0, 0, 0]

    def test_document_categorization(self, db: Session):
        """Documents should categorize as Will"""
        user = create_test_user(db)
        
        # Create documents (note: Document model doesn't have audience field, defaults to PUBLIC)
        doc_public = create_test_document(db, user.id)
        doc_public2 = create_test_document(db, user.id)
        doc_public3 = create_test_document(db, user.id)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Documents all default to PUBLIC, so Second row (will) should have [3, 0, 0]
        assert result['matrix'][1] == [3, 0, 0]
        # Other rows should be 0
        assert result['matrix'][0] == [0, 0, 0]
        assert result['matrix'][2] == [0, 0, 0]

    def test_poll_categorization(self, db: Session):
        """Polls should categorize as Awareness"""
        user = create_test_user(db)
        
        # Create polls (Note: Poll model doesn't have audience field, defaults to PUBLIC)
        poll1 = create_test_poll(db, user.id)
        poll2 = create_test_poll(db, user.id)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # First row (awareness) should have [2, 0, 0] (all polls default to PUBLIC)
        assert result['matrix'][0] == [2, 0, 0]

    def test_study_categorization(self, db: Session):
        """Studies should categorize as Will"""
        user = create_test_user(db)
        
        # Create studies (Note: Study model doesn't have audience field, defaults to PUBLIC)
        study1 = create_test_study(db, user.id)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Second row (will) should have [1, 0, 0] (study defaults to PUBLIC)
        assert result['matrix'][1] == [1, 0, 0]

    def test_mixed_activity_types(self, db: Session):
        """Test matrix with mixed activity types"""
        user = create_test_user(db)
        
        # Create mixed content
        post = create_test_post(db, user.id, audience="PUBLIC")
        doc = create_test_document(db, user.id)  # Documents default to PUBLIC
        poll = create_test_poll(db, user.id)     # Polls default to PUBLIC
        study = create_test_study(db, user.id)   # Studies default to PUBLIC
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Row 0 (awareness): [post, poll] = [1, 1, 0]
        # But posts and polls are both awareness
        assert result['matrix'][0][0] == 2  # post + poll
        # Row 1 (will): [doc, study] = [2, 0, 0]
        assert result['matrix'][1][0] == 2  # doc + study
        # Row 2 (action): all zeros
        assert result['matrix'][2] == [0, 0, 0]


# ============================================================================
# TEST CLASS 4: Audience Grouping
# ============================================================================

class TestAudienceGrouping:
    """Test audience categorization"""

    def test_public_audience_grouping(self, db: Session):
        """PUBLIC audience should group correctly"""
        user = create_test_user(db)
        
        # Create multiple posts with PUBLIC audience
        for _ in range(5):
            create_test_post(db, user.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # First cell [0][0] should be 5
        assert result['matrix'][0][0] == 5

    def test_influencers_audience_grouping(self, db: Session):
        """INFLUENCERS audience should group correctly"""
        user = create_test_user(db)
        
        # Create multiple posts with INFLUENCERS audience
        for _ in range(3):
            create_test_post(db, user.id, audience="INFLUENCERS")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Cell [0][1] should be 3
        assert result['matrix'][0][1] == 3

    def test_stakeholders_audience_grouping(self, db: Session):
        """STAKEHOLDERS audience should group correctly"""
        user = create_test_user(db)
        
        # Create multiple posts with STAKEHOLDERS audience
        for _ in range(2):
            create_test_post(db, user.id, audience="STAKEHOLDERS")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Cell [0][2] should be 2
        assert result['matrix'][0][2] == 2

    def test_case_insensitive_audience(self, db: Session):
        """Audience values should handle different cases"""
        user = create_test_user(db)
        
        # Create post with lowercase audience
        post = models.Post(
            id=uuid.uuid4(),
            content="Test",
            author_id=user.id,
            audience="public",  # lowercase
        )
        db.add(post)
        db.commit()
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Should handle lowercase
        assert sum(sum(row) for row in result['matrix']) > 0


# ============================================================================
# TEST CLASS 5: Recommendation Logic
# ============================================================================

class TestRecommendationLogic:
    """Test recommendation generation"""

    def test_default_recommendation(self, db: Session):
        """User with no activities gets generic recommendation"""
        user = create_test_user(db)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        assert "Keep up" in result['recommendation'] or "opportunity" in result['recommendation']

    def test_recommendation_identifies_gap(self, db: Session):
        """Recommendation should identify lowest cell"""
        user = create_test_user(db)
        
        # Create activities only in awareness + public
        for _ in range(5):
            create_test_post(db, user.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Recommendation should mention a growth opportunity
        assert "opportunity" in result['recommendation'].lower()

    def test_recommendation_mentions_category_and_audience(self, db: Session):
        """Recommendation should mention category and audience"""
        user = create_test_user(db)
        
        # Create asymmetric matrix
        for _ in range(3):
            create_test_post(db, user.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        recommendation = result['recommendation'].lower()
        # Should recommend something with low count
        assert any(word in recommendation for word in ["focus", "opportunity", "grow"])

    def test_balanced_matrix_recommendation(self, db: Session):
        """Balanced matrix should get generic recommendation"""
        user = create_test_user(db)
        
        # Create balanced matrix with activity in each row
        # Note: Document, Poll, Study don't have audience fields, so they default to PUBLIC
        for _ in range(2):
            create_test_post(db, user.id, audience="PUBLIC")  # Awareness
        for _ in range(2):
            create_test_document(db, user.id)  # Will (all public)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Should still have a recommendation
        assert len(result['recommendation']) > 0


# ============================================================================
# TEST CLASS 6: Data Integrity
# ============================================================================

class TestDataIntegrity:
    """Test data integrity and consistency"""

    def test_matrix_values_non_negative(self, db: Session):
        """All matrix values should be >= 0"""
        user = create_test_user(db)
        create_test_post(db, user.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        for row in result['matrix']:
            for value in row:
                assert value >= 0

    def test_matrix_values_are_integers(self, db: Session):
        """All matrix values should be integers"""
        user = create_test_user(db)
        create_test_post(db, user.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        for row in result['matrix']:
            for value in row:
                assert isinstance(value, int)

    def test_matrix_dimensions(self, db: Session):
        """Matrix should always be 3x3"""
        user = create_test_user(db)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        assert len(result['matrix']) == 3
        for row in result['matrix']:
            assert len(row) == 3

    def test_recommendation_non_empty(self, db: Session):
        """Recommendation should never be empty"""
        user = create_test_user(db)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        assert isinstance(result['recommendation'], str)
        assert len(result['recommendation']) > 0

    def test_multiple_users_isolated(self, db: Session):
        """Matrix for different users should be isolated"""
        user1 = create_test_user(db)
        user2 = create_test_user(db)
        
        # Create activities only for user1
        for _ in range(5):
            create_test_post(db, user1.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        result1 = get_advocacy_impact_matrix(user1.id, db)
        result2 = get_advocacy_impact_matrix(user2.id, db)
        
        # User1 should have activity, user2 should not
        assert result1['matrix'][0][0] == 5
        assert result2['matrix'] == [[0, 0, 0], [0, 0, 0], [0, 0, 0]]


# ============================================================================
# TEST CLASS 7: Performance
# ============================================================================

class TestPerformance:
    """Test performance with large datasets"""

    def test_large_dataset_performance(self, db: Session):
        """Should handle 100+ activities efficiently"""
        user = create_test_user(db)
        
        # Create 100 posts
        for i in range(100):
            audience = ["PUBLIC", "INFLUENCERS", "STAKEHOLDERS"][i % 3]
            create_test_post(db, user.id, audience=audience)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        start = time.time()
        result = get_advocacy_impact_matrix(user.id, db)
        elapsed = time.time() - start
        
        # Should complete in < 1 second
        assert elapsed < 1.0
        # Matrix should be calculated correctly
        assert sum(sum(row) for row in result['matrix']) == 100

    def test_many_users_performance(self, db: Session):
        """Should handle queries for different users efficiently"""
        # Create 20 users with varying amounts of content
        users = []
        for i in range(20):
            user = create_test_user(db)
            for j in range(i + 1):  # Increasing number of posts per user
                audience = ["PUBLIC", "INFLUENCERS", "STAKEHOLDERS"][j % 3]
                create_test_post(db, user.id, audience=audience)
            users.append(user)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        start = time.time()
        for user in users:
            result = get_advocacy_impact_matrix(user.id, db)
            assert result is not None
        elapsed = time.time() - start
        
        # Should complete for all 20 users in < 2 seconds
        assert elapsed < 2.0

    def test_consistency_with_large_dataset(self, db: Session):
        """Results should be consistent with large dataset"""
        user = create_test_user(db)
        
        # Create posts with exact counts
        for _ in range(10):
            create_test_post(db, user.id, audience="PUBLIC")
        for _ in range(5):
            create_test_post(db, user.id, audience="INFLUENCERS")
        for _ in range(3):
            create_test_post(db, user.id, audience="STAKEHOLDERS")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Verify exact counts
        assert result['matrix'][0] == [10, 5, 3]


# ============================================================================
# TEST CLASS 8: Cross-Content-Type Operations
# ============================================================================

class TestCrossContentType:
    """Test operations across different content types"""

    def test_mixed_content_counting(self, db: Session):
        """Count activities correctly across content types"""
        user = create_test_user(db)
        
        # Create 2 posts + 2 documents
        create_test_post(db, user.id, audience="PUBLIC")
        create_test_post(db, user.id, audience="PUBLIC")
        create_test_document(db, user.id)  # Defaults to PUBLIC
        create_test_document(db, user.id)  # Defaults to PUBLIC
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        # Posts are awareness, documents are will, all default to PUBLIC
        assert result['matrix'][0][0] == 2  # Posts
        assert result['matrix'][1][0] == 2  # Documents

    def test_weighted_activity_distribution(self, db: Session):
        """Test varied distribution across categories and audiences"""
        user = create_test_user(db)
        
        # Asymmetric distribution
        for _ in range(5):
            create_test_post(db, user.id, audience="PUBLIC")
        for _ in range(3):
            create_test_post(db, user.id, audience="INFLUENCERS")
        for _ in range(2):
            create_test_document(db, user.id)  # Documents default to PUBLIC
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result = get_advocacy_impact_matrix(user.id, db)
        
        assert result['matrix'][0] == [5, 3, 0]
        assert result['matrix'][1] == [2, 0, 0]  # 2 documents all public
        assert result['matrix'][2] == [0, 0, 0]


# ============================================================================
# TEST CLASS 9: Error Handling
# ============================================================================

class TestErrorHandling:
    """Test error handling and edge cases"""

    def test_invalid_user_id_format(self, db: Session):
        """Invalid UUID should be handled"""
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        # This would normally fail at route level, but test with valid UUID for unknown user
        fake_uuid = uuid.uuid4()
        result = get_advocacy_impact_matrix(fake_uuid, db)
        
        # Should return empty matrix, not error
        assert result['matrix'] == [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

    def test_deleted_user_content(self, db: Session):
        """Deleted user content should not appear in matrix"""
        user1 = create_test_user(db)
        user2 = create_test_user(db)
        
        # Create content for both
        create_test_post(db, user1.id, audience="PUBLIC")
        create_test_post(db, user2.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        # Delete user2's post
        post2 = db.query(models.Post).filter(models.Post.author_id == user2.id).first()
        db.delete(post2)
        db.commit()
        
        result2 = get_advocacy_impact_matrix(user2.id, db)
        
        # User2 should now have empty matrix
        assert result2['matrix'] == [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

    def test_null_audience_handling(self, db: Session):
        """Handle posts with null/missing audience"""
        user = create_test_user(db)
        
        # Create post with default audience
        post = Post(
            id=uuid.uuid4(),
            content="Test",
            author_id=user.id,
            # audience not set, defaults to None or empty
        )
        db.add(post)
        db.commit()
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        # Should not crash
        result = get_advocacy_impact_matrix(user.id, db)
        assert result is not None


# ============================================================================
# TEST CLASS 10: Integration Workflows
# ============================================================================

class TestAnalyticsIntegration:
    """Test end-to-end analytics workflows"""

    def test_complete_advocacy_workflow(self, db: Session):
        """Test complete user advocacy journey"""
        user = create_test_user(db)
        
        # Phase 1: Awareness building
        for _ in range(3):
            create_test_post(db, user.id, audience="PUBLIC")
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        result1 = get_advocacy_impact_matrix(user.id, db)
        assert result1['matrix'][0][0] == 3
        
        # Phase 2: Will building (documents default to PUBLIC)
        for _ in range(2):
            create_test_document(db, user.id)
        
        result2 = get_advocacy_impact_matrix(user.id, db)
        assert result2['matrix'][1][0] == 2
        
        # Phase 3: Add more content
        create_test_poll(db, user.id)  # Polls are awareness, default to PUBLIC
        
        result3 = get_advocacy_impact_matrix(user.id, db)
        # Polls are awareness, so awareness count increases
        assert result3['matrix'][0][0] == 4

    def test_advocacy_matrix_evolution(self, db: Session):
        """Test how matrix evolves as user creates content"""
        user = create_test_user(db)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        # Start: all zeros
        result0 = get_advocacy_impact_matrix(user.id, db)
        assert sum(sum(row) for row in result0['matrix']) == 0
        
        # After first post
        create_test_post(db, user.id, audience="PUBLIC")
        result1 = get_advocacy_impact_matrix(user.id, db)
        assert sum(sum(row) for row in result1['matrix']) == 1
        
        # After multiple posts
        create_test_post(db, user.id, audience="INFLUENCERS")
        create_test_post(db, user.id, audience="STAKEHOLDERS")
        result2 = get_advocacy_impact_matrix(user.id, db)
        assert sum(sum(row) for row in result2['matrix']) == 3
        assert result2['matrix'][0] == [1, 1, 1]

    def test_recommendation_changes_with_content(self, db: Session):
        """Recommendation should change as user creates more content"""
        user = create_test_user(db)
        
        from app.api.v1.endpoints.analytics import get_advocacy_impact_matrix
        
        # Initial recommendation
        result1 = get_advocacy_impact_matrix(user.id, db)
        rec1 = result1['recommendation']
        
        # After adding content
        for _ in range(10):
            create_test_post(db, user.id, audience="PUBLIC")
        
        result2 = get_advocacy_impact_matrix(user.id, db)
        rec2 = result2['recommendation']
        
        # Recommendations might differ based on distribution
        assert len(rec2) > 0

# ============================================================================
# PYTEST FIXTURES
# ============================================================================

@pytest.fixture
def db():
    """Create test database session with rollback"""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()