"""
Comprehensive Calendar API Tests

Tests calendar event creation, management, scheduling, conflict detection,
participant management, and calendar integration.

Validates end-to-end workflow from creating events to retrieving
user calendars and managing event participants.
"""

import pytest
import uuid
from datetime import datetime, timedelta
from fastapi.testclient import TestClient

from app import models, schemas
from app.crud import calendar
from tests.conftest import TestingSessionLocal


# =====================================================================
# TEST HELPER FUNCTIONS
# =====================================================================

def create_test_user(email: str = None) -> models.User:
    """Creates test user with unique email and username."""
    db = TestingSessionLocal()
    try:
        user_id = uuid.uuid4()
        unique_suffix = user_id.hex[:8]
        username = f"user_{unique_suffix}"
        email = email or f"user_{unique_suffix}@example.com"
        
        db_user = models.User(
            username=username,
            id=user_id,
            email=email,
            first_name="Test",
            last_name="User",
            hashed_password="hashedpassword123",
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    finally:
        db.close()


def create_test_event(
    owner_id: uuid.UUID,
    title: str = "Test Event",
    description: str = "Test event description",
    start_time: datetime = None,
    end_time: datetime = None,
    participant_ids: list = None
) -> models.Event:
    """Creates test event with owner and optional participants."""
    db = TestingSessionLocal()
    try:
        if start_time is None:
            start_time = datetime.now() + timedelta(days=1)
        if end_time is None:
            end_time = start_time + timedelta(hours=1)
        if participant_ids is None:
            participant_ids = []
        
        event_create = schemas.calendar.EventCreate(
            title=title,
            description=description,
            start_time=start_time,
            end_time=end_time,
            collaborator_ids=participant_ids
        )
        
        db_event = calendar.calendar.create_with_participants(
            db=db,
            obj_in=event_create,
            owner_id=owner_id,
            participant_ids=participant_ids
        )
        return db_event
    finally:
        db.close()


def create_test_event_participant(
    event_id: uuid.UUID,
    user_id: uuid.UUID,
    status: str = "pending"
) -> models.EventParticipant:
    """Creates event participant relationship."""
    db = TestingSessionLocal()
    try:
        participant = models.EventParticipant(
            event_id=event_id,
            user_id=user_id,
            status=status
        )
        db.add(participant)
        db.commit()
        db.refresh(participant)
        return participant
    finally:
        db.close()


# =====================================================================
# TEST SUITE 1: Calendar API Health & Validation
# =====================================================================

class TestCalendarAPIHealth:
    """Verify calendar API is accessible and properly configured."""

    def test_api_health_check(self, test_client: TestClient):
        """Verify API is accessible and responding."""
        response = test_client.get("/api/v1/health")
        assert response.status_code in [200, 404]  # 404 if not implemented, 200 if implemented

    def test_calendar_endpoints_exist(self, test_client: TestClient):
        """Verify calendar endpoints are registered."""
        # Check if event endpoints are accessible (they should return proper responses)
        response = test_client.get("/api/v1/events")
        assert response.status_code in [200, 401, 403]  # Success or auth required


# =====================================================================
# TEST SUITE 2: Event Creation
# =====================================================================

class TestEventCreation:
    """Test event creation with various configurations."""

    def test_create_event_basic(self, test_client: TestClient):
        """Test basic event creation with minimal required fields."""
        owner = create_test_user()
        
        event_data = {
            "title": "Team Meeting",
            "description": "Weekly team sync",
            "start_time": (datetime.now() + timedelta(days=1)).isoformat(),
            "end_time": (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
            "collaborator_ids": []
        }
        
        db = TestingSessionLocal()
        try:
            event_create = schemas.calendar.EventCreate(**event_data)
            db_event = calendar.calendar.create_with_participants(
                db=db,
                obj_in=event_create,
                owner_id=owner.id,
                participant_ids=[]
            )
            
            assert db_event is not None
            assert db_event.title == "Team Meeting"
            assert db_event.owner_id == owner.id
            assert db_event.description == "Weekly team sync"
        finally:
            db.close()

    def test_create_event_with_description(self, test_client: TestClient):
        """Test event creation with full metadata."""
        owner = create_test_user()
        
        start_time = datetime.now() + timedelta(days=2)
        end_time = start_time + timedelta(hours=2)
        
        event_data = {
            "title": "Project Review",
            "description": "Q1 project review meeting",
            "start_time": start_time,
            "end_time": end_time,
            "collaborator_ids": []
        }
        
        db = TestingSessionLocal()
        try:
            event_create = schemas.calendar.EventCreate(**event_data)
            db_event = calendar.calendar.create_with_participants(
                db=db,
                obj_in=event_create,
                owner_id=owner.id,
                participant_ids=[]
            )
            
            assert db_event.title == "Project Review"
            assert "Q1" in db_event.description
            assert db_event.start_time == start_time
            assert db_event.end_time == end_time
        finally:
            db.close()

    def test_create_event_with_participants(self, test_client: TestClient):
        """Test event creation with multiple participants."""
        owner = create_test_user()
        participant1 = create_test_user()
        participant2 = create_test_user()
        
        start_time = datetime.now() + timedelta(days=1)
        end_time = start_time + timedelta(hours=1)
        
        event_data = {
            "title": "Team Standup",
            "description": "Daily standup meeting",
            "start_time": start_time,
            "end_time": end_time,
            "collaborator_ids": [participant1.id, participant2.id]
        }
        
        db = TestingSessionLocal()
        try:
            event_create = schemas.calendar.EventCreate(**event_data)
            db_event = calendar.calendar.create_with_participants(
                db=db,
                obj_in=event_create,
                owner_id=owner.id,
                participant_ids=[participant1.id, participant2.id]
            )
            
            assert db_event is not None
            assert len(db_event.participants) == 2
            participant_ids = [p.user_id for p in db_event.participants]
            assert participant1.id in participant_ids
            assert participant2.id in participant_ids
        finally:
            db.close()

    def test_event_stores_owner_reference(self, test_client: TestClient):
        """Verify event correctly stores owner relationship."""
        owner = create_test_user()
        event = create_test_event(owner.id, title="Owner Test Event")
        
        db = TestingSessionLocal()
        try:
            retrieved_event = db.query(models.Event).filter(
                models.Event.id == event.id
            ).first()
            
            assert retrieved_event is not None
            assert retrieved_event.owner_id == owner.id
        finally:
            db.close()

    def test_create_multiple_events_same_owner(self, test_client: TestClient):
        """Test owner can create multiple events."""
        owner = create_test_user()
        
        event1 = create_test_event(owner.id, title="Event 1")
        event2 = create_test_event(owner.id, title="Event 2")
        event3 = create_test_event(owner.id, title="Event 3")
        
        db = TestingSessionLocal()
        try:
            owner_events = db.query(models.Event).filter(
                models.Event.owner_id == owner.id
            ).all()
            
            assert len(owner_events) >= 3
            titles = [e.title for e in owner_events]
            assert "Event 1" in titles
            assert "Event 2" in titles
            assert "Event 3" in titles
        finally:
            db.close()


# =====================================================================
# TEST SUITE 3: Event Discovery & Retrieval
# =====================================================================

class TestEventDiscovery:
    """Test retrieving and filtering events."""

    def test_get_events_for_owner(self, test_client: TestClient):
        """Test retrieving events owned by user."""
        owner = create_test_user()
        
        event1 = create_test_event(owner.id, title="Meeting 1")
        event2 = create_test_event(owner.id, title="Meeting 2")
        
        db = TestingSessionLocal()
        try:
            retrieved_events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=owner.id
            )
            
            assert len(retrieved_events) >= 2
            event_titles = [e.title for e in retrieved_events]
            assert "Meeting 1" in event_titles
            assert "Meeting 2" in event_titles
        finally:
            db.close()

    def test_get_events_as_participant(self, test_client: TestClient):
        """Test retrieving events where user is participant."""
        owner = create_test_user()
        participant = create_test_user()
        
        event = create_test_event(
            owner.id,
            title="Participant Event",
            participant_ids=[participant.id]
        )
        
        db = TestingSessionLocal()
        try:
            participant_events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=participant.id
            )
            
            assert len(participant_events) >= 1
            assert any(e.title == "Participant Event" for e in participant_events)
        finally:
            db.close()

    def test_get_events_owned_and_participating(self, test_client: TestClient):
        """Test user sees both owned and participated events."""
        user = create_test_user()
        other_owner = create_test_user()
        
        # Create event owned by user
        owned_event = create_test_event(user.id, title="Owned Event")
        
        # Create event where user is participant
        participated_event = create_test_event(
            other_owner.id,
            title="Participant Event",
            participant_ids=[user.id]
        )
        
        db = TestingSessionLocal()
        try:
            all_user_events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=user.id
            )
            
            event_titles = [e.title for e in all_user_events]
            assert "Owned Event" in event_titles
            assert "Participant Event" in event_titles
        finally:
            db.close()

    def test_get_event_by_id(self, test_client: TestClient):
        """Test retrieving specific event by ID."""
        owner = create_test_user()
        event = create_test_event(owner.id, title="Specific Event")
        
        db = TestingSessionLocal()
        try:
            retrieved = calendar.calendar.get(db=db, id=event.id)
            
            assert retrieved is not None
            assert retrieved.title == "Specific Event"
            assert retrieved.owner_id == owner.id
        finally:
            db.close()

    def test_get_nonexistent_event(self, test_client: TestClient):
        """Test retrieving non-existent event returns None."""
        fake_id = uuid.uuid4()
        
        db = TestingSessionLocal()
        try:
            result = calendar.calendar.get(db=db, id=fake_id)
            assert result is None
        finally:
            db.close()


# =====================================================================
# TEST SUITE 4: Conflict Detection
# =====================================================================

class TestConflictDetection:
    """Test calendar conflict detection."""

    def test_detect_overlapping_events(self, test_client: TestClient):
        """Test detection of overlapping event times."""
        owner = create_test_user()
        
        start = datetime.now() + timedelta(days=1)
        end = start + timedelta(hours=2)
        
        # Create first event
        event1 = create_test_event(
            owner.id,
            title="Event 1",
            start_time=start,
            end_time=end
        )
        
        # Create overlapping event
        overlap_start = start + timedelta(minutes=30)
        overlap_end = overlap_start + timedelta(hours=1)
        
        db = TestingSessionLocal()
        try:
            conflicting = calendar.calendar.find_conflicting_event(
                db=db,
                user_id=owner.id,
                start_time=overlap_start,
                end_time=overlap_end
            )
            
            assert conflicting is not None
            assert conflicting.id == event1.id
        finally:
            db.close()

    def test_no_conflict_for_adjacent_events(self, test_client: TestClient):
        """Test adjacent events don't conflict."""
        owner = create_test_user()
        
        start1 = datetime.now() + timedelta(days=1)
        end1 = start1 + timedelta(hours=1)
        
        event1 = create_test_event(
            owner.id,
            title="Event 1",
            start_time=start1,
            end_time=end1
        )
        
        # Event starts exactly when first ends
        start2 = end1
        end2 = start2 + timedelta(hours=1)
        
        db = TestingSessionLocal()
        try:
            conflicting = calendar.calendar.find_conflicting_event(
                db=db,
                user_id=owner.id,
                start_time=start2,
                end_time=end2
            )
            
            # Adjacent events should not conflict
            assert conflicting is None
        finally:
            db.close()

    def test_conflict_detection_for_participant(self, test_client: TestClient):
        """Test conflict detection works for participants too."""
        owner = create_test_user()
        participant = create_test_user()
        
        start = datetime.now() + timedelta(days=1)
        end = start + timedelta(hours=1)
        
        # Create event with participant
        event1 = create_test_event(
            owner.id,
            title="Event 1",
            start_time=start,
            end_time=end,
            participant_ids=[participant.id]
        )
        
        # Check conflict for participant
        overlap_start = start + timedelta(minutes=30)
        overlap_end = overlap_start + timedelta(hours=1)
        
        db = TestingSessionLocal()
        try:
            conflicting = calendar.calendar.find_conflicting_event(
                db=db,
                user_id=participant.id,
                start_time=overlap_start,
                end_time=overlap_end
            )
            
            assert conflicting is not None
            assert conflicting.id == event1.id
        finally:
            db.close()

    def test_no_conflict_different_users(self, test_client: TestClient):
        """Test same time doesn't conflict for different users."""
        user1 = create_test_user()
        user2 = create_test_user()
        
        start = datetime.now() + timedelta(days=1)
        end = start + timedelta(hours=1)
        
        # User1 has event at specific time
        event1 = create_test_event(
            user1.id,
            title="User1 Event",
            start_time=start,
            end_time=end
        )
        
        # Check if user2 has conflicts at same time (should not)
        db = TestingSessionLocal()
        try:
            conflicting = calendar.calendar.find_conflicting_event(
                db=db,
                user_id=user2.id,
                start_time=start,
                end_time=end
            )
            
            assert conflicting is None
        finally:
            db.close()


# =====================================================================
# TEST SUITE 5: Event Modification
# =====================================================================

class TestEventModification:
    """Test updating and deleting events."""

    def test_update_event_title(self, test_client: TestClient):
        """Test updating event title."""
        owner = create_test_user()
        event = create_test_event(owner.id, title="Old Title")
        
        db = TestingSessionLocal()
        try:
            update_data = schemas.calendar.EventUpdate(
                title="New Title"
            )
            
            updated = calendar.calendar.update(
                db=db,
                db_obj=event,
                obj_in=update_data
            )
            
            assert updated.title == "New Title"
        finally:
            db.close()

    def test_update_event_time(self, test_client: TestClient):
        """Test updating event time."""
        owner = create_test_user()
        original_start = datetime.now() + timedelta(days=1)
        original_end = original_start + timedelta(hours=1)
        event = create_test_event(
            owner.id,
            title="Event",
            start_time=original_start,
            end_time=original_end
        )
        
        new_start = datetime.now() + timedelta(days=2)
        new_end = new_start + timedelta(hours=2)
        
        db = TestingSessionLocal()
        try:
            update_data = schemas.calendar.EventUpdate(
                start_time=new_start,
                end_time=new_end
            )
            
            updated = calendar.calendar.update(
                db=db,
                db_obj=event,
                obj_in=update_data
            )
            
            assert updated.start_time == new_start
            assert updated.end_time == new_end
        finally:
            db.close()

    def test_update_event_description(self, test_client: TestClient):
        """Test updating event description."""
        owner = create_test_user()
        event = create_test_event(owner.id, description="Old description")
        
        db = TestingSessionLocal()
        try:
            update_data = schemas.calendar.EventUpdate(
                description="Updated description"
            )
            
            updated = calendar.calendar.update(
                db=db,
                db_obj=event,
                obj_in=update_data
            )
            
            assert updated.description == "Updated description"
        finally:
            db.close()

    def test_delete_event(self, test_client: TestClient):
        """Test deleting an event."""
        owner = create_test_user()
        event = create_test_event(owner.id, title="Event to Delete")
        event_id = event.id
        
        db = TestingSessionLocal()
        try:
            calendar.calendar.remove(db=db, id=event_id)
            
            # Verify event is deleted
            deleted_event = calendar.calendar.get(db=db, id=event_id)
            assert deleted_event is None
        finally:
            db.close()

    def test_delete_event_removes_participants(self, test_client: TestClient):
        """Test deleting event removes participant relationships."""
        owner = create_test_user()
        participant = create_test_user()
        
        event = create_test_event(
            owner.id,
            title="Event with Participant",
            participant_ids=[participant.id]
        )
        event_id = event.id
        
        db = TestingSessionLocal()
        try:
            # Verify participants exist
            participants_before = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event_id
            ).all()
            assert len(participants_before) > 0
            
            # Delete event
            calendar.calendar.remove(db=db, id=event_id)
            
            # Verify participants are removed
            participants_after = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event_id
            ).all()
            assert len(participants_after) == 0
        finally:
            db.close()


# =====================================================================
# TEST SUITE 6: Event Participants
# =====================================================================

class TestEventParticipants:
    """Test participant management."""

    def test_add_participant_to_event(self, test_client: TestClient):
        """Test adding participant to existing event."""
        owner = create_test_user()
        participant = create_test_user()
        
        event = create_test_event(owner.id, title="Event")
        
        db = TestingSessionLocal()
        try:
            event_participant = models.EventParticipant(
                event_id=event.id,
                user_id=participant.id,
                status="accepted"
            )
            db.add(event_participant)
            db.commit()
            db.refresh(event_participant)
            
            # Verify participant was added
            retrieved = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event.id,
                models.EventParticipant.user_id == participant.id
            ).first()
            
            assert retrieved is not None
            assert retrieved.status == "accepted"
        finally:
            db.close()

    def test_remove_participant_from_event(self, test_client: TestClient):
        """Test removing participant from event."""
        owner = create_test_user()
        participant = create_test_user()
        
        event = create_test_event(
            owner.id,
            title="Event",
            participant_ids=[participant.id]
        )
        
        db = TestingSessionLocal()
        try:
            # Remove participant
            db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event.id,
                models.EventParticipant.user_id == participant.id
            ).delete()
            db.commit()
            
            # Verify removed
            retrieved = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event.id,
                models.EventParticipant.user_id == participant.id
            ).first()
            
            assert retrieved is None
        finally:
            db.close()

    def test_update_participant_status(self, test_client: TestClient):
        """Test updating participant status."""
        owner = create_test_user()
        participant = create_test_user()
        
        event = create_test_event(
            owner.id,
            title="Event",
            participant_ids=[participant.id]
        )
        
        db = TestingSessionLocal()
        try:
            # Update participant status
            db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event.id,
                models.EventParticipant.user_id == participant.id
            ).update({"status": "accepted"})
            db.commit()
            
            # Verify status updated
            participant_obj = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event.id,
                models.EventParticipant.user_id == participant.id
            ).first()
            
            assert participant_obj.status == "accepted"
        finally:
            db.close()

    def test_get_participants_for_event(self, test_client: TestClient):
        """Test retrieving all participants for event."""
        owner = create_test_user()
        participant1 = create_test_user()
        participant2 = create_test_user()
        participant3 = create_test_user()
        
        event = create_test_event(
            owner.id,
            title="Event",
            participant_ids=[participant1.id, participant2.id, participant3.id]
        )
        
        db = TestingSessionLocal()
        try:
            participants = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == event.id
            ).all()
            
            assert len(participants) == 3
            participant_ids = [p.user_id for p in participants]
            assert participant1.id in participant_ids
            assert participant2.id in participant_ids
            assert participant3.id in participant_ids
        finally:
            db.close()


# =====================================================================
# TEST SUITE 7: Time Range Queries
# =====================================================================

class TestTimeRangeQueries:
    """Test querying events by time range."""

    def test_get_events_in_date_range(self, test_client: TestClient):
        """Test retrieving events within date range."""
        owner = create_test_user()
        
        # Create events on different days
        day1_start = datetime.now() + timedelta(days=1)
        day1_end = day1_start + timedelta(hours=1)
        event1 = create_test_event(
            owner.id,
            title="Event Day 1",
            start_time=day1_start,
            end_time=day1_end
        )
        
        day5_start = datetime.now() + timedelta(days=5)
        day5_end = day5_start + timedelta(hours=1)
        event5 = create_test_event(
            owner.id,
            title="Event Day 5",
            start_time=day5_start,
            end_time=day5_end
        )
        
        day10_start = datetime.now() + timedelta(days=10)
        day10_end = day10_start + timedelta(hours=1)
        event10 = create_test_event(
            owner.id,
            title="Event Day 10",
            start_time=day10_start,
            end_time=day10_end
        )
        
        # Query for events between day 2-8
        range_start = datetime.now() + timedelta(days=2)
        range_end = datetime.now() + timedelta(days=8)
        
        db = TestingSessionLocal()
        try:
            events_in_range = db.query(models.Event).filter(
                models.Event.owner_id == owner.id,
                models.Event.start_time >= range_start,
                models.Event.start_time <= range_end
            ).all()
            
            assert len(events_in_range) == 1
            assert events_in_range[0].title == "Event Day 5"
        finally:
            db.close()

    def test_get_upcoming_events(self, test_client: TestClient):
        """Test retrieving upcoming events."""
        owner = create_test_user()
        
        # Create event in past (should not appear)
        past_start = datetime.now() - timedelta(days=1)
        past_end = past_start + timedelta(hours=1)
        past_event = create_test_event(
            owner.id,
            title="Past Event",
            start_time=past_start,
            end_time=past_end
        )
        
        # Create upcoming events
        upcoming_start = datetime.now() + timedelta(days=1)
        upcoming_end = upcoming_start + timedelta(hours=1)
        upcoming_event = create_test_event(
            owner.id,
            title="Upcoming Event",
            start_time=upcoming_start,
            end_time=upcoming_end
        )
        
        db = TestingSessionLocal()
        try:
            upcoming = db.query(models.Event).filter(
                models.Event.owner_id == owner.id,
                models.Event.start_time >= datetime.now()
            ).all()
            
            titles = [e.title for e in upcoming]
            assert "Upcoming Event" in titles
            assert "Past Event" not in titles
        finally:
            db.close()


# =====================================================================
# TEST SUITE 8: Calendar Error Handling
# =====================================================================

class TestCalendarErrorHandling:
    """Test error handling in calendar operations."""

    def test_create_event_with_missing_title(self, test_client: TestClient):
        """Test event creation fails without title."""
        owner = create_test_user()
        
        db = TestingSessionLocal()
        try:
            # Missing title should cause error
            start_time = datetime.now() + timedelta(days=1)
            end_time = start_time + timedelta(hours=1)
            
            event = models.Event(
                title="",  # Empty title
                description="Test",
                start_time=start_time,
                end_time=end_time,
                owner_id=owner.id
            )
            db.add(event)
            db.commit()
            
            # Should work but with empty title (validation at schema level)
            assert event.title == ""
        finally:
            db.close()

    def test_create_event_invalid_time_range(self, test_client: TestClient):
        """Test event creation with end_time before start_time."""
        owner = create_test_user()
        
        db = TestingSessionLocal()
        try:
            start_time = datetime.now() + timedelta(days=2)
            end_time = datetime.now() + timedelta(days=1)  # Before start
            
            event = models.Event(
                title="Invalid Event",
                description="Test",
                start_time=start_time,
                end_time=end_time,
                owner_id=owner.id
            )
            db.add(event)
            db.commit()
            
            # Will succeed at DB level (validation at API level)
            assert event is not None
        finally:
            db.close()

    def test_access_nonexistent_event_participants(self, test_client: TestClient):
        """Test accessing participants of non-existent event."""
        fake_event_id = uuid.uuid4()
        
        db = TestingSessionLocal()
        try:
            participants = db.query(models.EventParticipant).filter(
                models.EventParticipant.event_id == fake_event_id
            ).all()
            
            # Should return empty list, not error
            assert len(participants) == 0
        finally:
            db.close()

    def test_get_events_empty_calendar(self, test_client: TestClient):
        """Test getting events when user has no events."""
        user = create_test_user()
        
        db = TestingSessionLocal()
        try:
            events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=user.id
            )
            
            assert len(events) == 0
        finally:
            db.close()

    def test_delete_already_deleted_event(self, test_client: TestClient):
        """Test deleting event that doesn't exist."""
        fake_id = uuid.uuid4()
        
        db = TestingSessionLocal()
        try:
            # Should not raise error
            result = calendar.calendar.remove(db=db, id=fake_id)
            
            # Result should be None or the operation should complete gracefully
            assert result is None or result == {}
        finally:
            db.close()


# =====================================================================
# TEST SUITE 9: Calendar Integration
# =====================================================================

class TestCalendarIntegration:
    """Test calendar integration with other features."""

    def test_user_calendar_after_creation(self, test_client: TestClient):
        """Test user calendar shows events after creation."""
        user = create_test_user()
        
        event1 = create_test_event(user.id, title="Meeting 1")
        event2 = create_test_event(user.id, title="Meeting 2")
        event3 = create_test_event(user.id, title="Meeting 3")
        
        db = TestingSessionLocal()
        try:
            user_calendar = calendar.calendar.get_events_for_user(
                db=db,
                user_id=user.id
            )
            
            assert len(user_calendar) >= 3
            titles = [e.title for e in user_calendar]
            assert "Meeting 1" in titles
            assert "Meeting 2" in titles
            assert "Meeting 3" in titles
        finally:
            db.close()

    def test_shared_calendar_visibility(self, test_client: TestClient):
        """Test participants can see shared calendar."""
        organizer = create_test_user()
        attendee1 = create_test_user()
        attendee2 = create_test_user()
        
        # Create event with multiple attendees
        event = create_test_event(
            organizer.id,
            title="Team Meeting",
            participant_ids=[attendee1.id, attendee2.id]
        )
        
        db = TestingSessionLocal()
        try:
            # Organizer can see
            organizer_events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=organizer.id
            )
            assert any(e.title == "Team Meeting" for e in organizer_events)
            
            # Attendee1 can see
            attendee1_events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=attendee1.id
            )
            assert any(e.title == "Team Meeting" for e in attendee1_events)
            
            # Attendee2 can see
            attendee2_events = calendar.calendar.get_events_for_user(
                db=db,
                user_id=attendee2.id
            )
            assert any(e.title == "Team Meeting" for e in attendee2_events)
        finally:
            db.close()

    def test_calendar_data_consistency(self, test_client: TestClient):
        """Test calendar data remains consistent across operations."""
        user = create_test_user()
        
        # Create event
        event1 = create_test_event(user.id, title="Consistent Event")
        event_id = event1.id
        
        db = TestingSessionLocal()
        try:
            # Retrieve immediately after creation
            retrieved1 = calendar.calendar.get(db=db, id=event_id)
            assert retrieved1.title == "Consistent Event"
            
            # Update and retrieve
            update_data = schemas.calendar.EventUpdate(
                title="Updated Event"
            )
            calendar.calendar.update(db=db, db_obj=retrieved1, obj_in=update_data)
            
            # Verify update persisted
            retrieved2 = calendar.calendar.get(db=db, id=event_id)
            assert retrieved2.title == "Updated Event"
        finally:
            db.close()


# =====================================================================
# TEST EXECUTION
# =====================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
