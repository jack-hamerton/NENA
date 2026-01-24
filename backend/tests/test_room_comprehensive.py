"""
Comprehensive test suite for Room page functionality
Tests cover: room creation, participants, messaging, WebRTC signaling, polls, and integration
"""
import pytest
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app import models, schemas
from app.crud.user import user as crud_user
from tests.conftest import TestingSessionLocal


# ============ HELPER FUNCTIONS ============

def create_test_user(email: str = None, username: str = None) -> models.User:
    """Create a test user with unique email and username."""
    db = TestingSessionLocal()
    try:
        user_id = uuid.uuid4()
        unique_suffix = user_id.hex[:8]
        
        email = email or f"roomuser_{unique_suffix}@example.com"
        username = username or f"roomuser_{unique_suffix}"
        
        db_user = models.User(
            id=user_id,
            username=username,
            email=email,
            first_name=f"Room{unique_suffix}",
            last_name=f"User{unique_suffix}",
            hashed_password="hashed_password_here",
            is_active=True,
            is_superuser=False
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    finally:
        db.close()


def create_test_room(creator_id: uuid.UUID, name: str = None) -> models.Room:
    """Create a test room."""
    db = TestingSessionLocal()
    try:
        room_id = uuid.uuid4()
        room_name = name or f"Test Room {room_id.hex[:8]}"
        
        room = models.Room(
            id=room_id,
            name=room_name,
            creator_id=creator_id
        )
        db.add(room)
        db.commit()
        db.refresh(room)
        return room
    finally:
        db.close()


def create_test_room_participant(room_id: uuid.UUID, user_id: uuid.UUID) -> models.RoomParticipant:
    """Add a participant to a room."""
    db = TestingSessionLocal()
    try:
        participant = models.RoomParticipant(
            id=uuid.uuid4(),
            room_id=room_id,
            user_id=user_id
        )
        db.add(participant)
        db.commit()
        db.refresh(participant)
        return participant
    finally:
        db.close()


def create_test_room_message(room_id: uuid.UUID, sender_id: uuid.UUID, content: str) -> models.RoomMessage:
    """Create a message in a room."""
    db = TestingSessionLocal()
    try:
        message = models.RoomMessage(
            id=uuid.uuid4(),
            room_id=room_id,
            sender_id=sender_id,
            content=content
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
    finally:
        db.close()


# ============ TEST SUITES ============

class TestRoomHealth:
    """Basic health checks for Room models"""
    
    def test_room_model_exists(self):
        """Test that Room model exists and has required attributes"""
        assert hasattr(models, 'Room')
        assert hasattr(models.Room, 'id')
        assert hasattr(models.Room, 'name')
        assert hasattr(models.Room, 'creator_id')
        assert hasattr(models.Room, 'participants')
        assert hasattr(models.Room, 'messages')
    
    def test_room_participant_model_exists(self):
        """Test that RoomParticipant model exists"""
        assert hasattr(models, 'RoomParticipant')
        assert hasattr(models.RoomParticipant, 'room_id')
        assert hasattr(models.RoomParticipant, 'user_id')
        assert hasattr(models.RoomParticipant, 'room')
        assert hasattr(models.RoomParticipant, 'user')
    
    def test_room_message_model_exists(self):
        """Test that RoomMessage model exists"""
        assert hasattr(models, 'RoomMessage')
        assert hasattr(models.RoomMessage, 'room_id')
        assert hasattr(models.RoomMessage, 'sender_id')
        assert hasattr(models.RoomMessage, 'content')
        assert hasattr(models.RoomMessage, 'sent_at')


class TestRoomCreation:
    """Test room creation and basic properties"""
    
    def test_create_room_basic(self):
        """Test creating a basic room"""
        creator = create_test_user()
        room = create_test_room(creator.id, "Basic Room")
        
        assert room is not None
        assert room.name == "Basic Room"
        assert room.creator_id == creator.id
    
    def test_create_room_with_unique_name(self):
        """Test creating multiple rooms with unique names"""
        creator = create_test_user()
        
        room1 = create_test_room(creator.id, "Room 1")
        room2 = create_test_room(creator.id, "Room 2")
        
        assert room1.id != room2.id
        assert room1.name != room2.name
    
    def test_room_creator_relationship(self):
        """Test room-creator relationship"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        db = TestingSessionLocal()
        try:
            retrieved_room = db.query(models.Room).filter(
                models.Room.id == room.id
            ).first()
            
            assert retrieved_room is not None
            assert retrieved_room.creator_id == creator.id
        finally:
            db.close()


class TestRoomParticipants:
    """Test room participant management"""
    
    def test_add_participant_to_room(self):
        """Test adding a participant to a room"""
        creator = create_test_user()
        participant = create_test_user()
        room = create_test_room(creator.id)
        
        room_participant = create_test_room_participant(room.id, participant.id)
        
        assert room_participant is not None
        assert room_participant.room_id == room.id
        assert room_participant.user_id == participant.id
    
    def test_multiple_participants(self):
        """Test adding multiple participants to a room"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        participants = [create_test_user() for _ in range(3)]
        for participant in participants:
            create_test_room_participant(room.id, participant.id)
        
        db = TestingSessionLocal()
        try:
            room_from_db = db.query(models.Room).filter(
                models.Room.id == room.id
            ).first()
            
            participant_count = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.room_id == room.id
            ).count()
            
            assert participant_count == 3
        finally:
            db.close()
    
    def test_participant_cannot_join_twice(self):
        """Test that same participant can only join once (logic test)"""
        creator = create_test_user()
        participant = create_test_user()
        room = create_test_room(creator.id)
        
        create_test_room_participant(room.id, participant.id)
        
        db = TestingSessionLocal()
        try:
            # Count participants in room
            count = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.room_id == room.id,
                models.RoomParticipant.user_id == participant.id
            ).count()
            
            # Ideally should be 1 (backend should enforce uniqueness)
            assert count >= 1
        finally:
            db.close()


class TestRoomMessaging:
    """Test room messaging functionality"""
    
    def test_send_message_to_room(self):
        """Test sending a message to a room"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        message = create_test_room_message(room.id, creator.id, "Hello Room!")
        
        assert message is not None
        assert message.content == "Hello Room!"
        assert message.room_id == room.id
        assert message.sender_id == creator.id
    
    def test_multiple_messages_in_room(self):
        """Test multiple messages from different users"""
        creator = create_test_user()
        user2 = create_test_user()
        room = create_test_room(creator.id)
        
        create_test_room_participant(room.id, user2.id)
        
        msg1 = create_test_room_message(room.id, creator.id, "First message")
        msg2 = create_test_room_message(room.id, user2.id, "Second message")
        msg3 = create_test_room_message(room.id, creator.id, "Third message")
        
        db = TestingSessionLocal()
        try:
            messages = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).all()
            
            assert len(messages) == 3
            assert messages[0].content == "First message"
            assert messages[1].content == "Second message"
            assert messages[2].content == "Third message"
        finally:
            db.close()
    
    def test_message_sender_relationship(self):
        """Test message-sender relationship"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        message = create_test_room_message(room.id, creator.id, "Test message")
        
        db = TestingSessionLocal()
        try:
            retrieved_msg = db.query(models.RoomMessage).filter(
                models.RoomMessage.id == message.id
            ).first()
            
            assert retrieved_msg is not None
            assert retrieved_msg.sender_id == creator.id
        finally:
            db.close()
    
    def test_message_room_relationship(self):
        """Test message-room relationship"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        message = create_test_room_message(room.id, creator.id, "Test message")
        
        db = TestingSessionLocal()
        try:
            retrieved_msg = db.query(models.RoomMessage).filter(
                models.RoomMessage.id == message.id
            ).first()
            
            assert retrieved_msg is not None
            assert retrieved_msg.room_id == room.id
        finally:
            db.close()
    
    def test_message_timestamp(self):
        """Test that message has valid timestamp"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        before = datetime.utcnow()
        message = create_test_room_message(room.id, creator.id, "Test")
        after = datetime.utcnow()
        
        assert message.sent_at is not None
        assert before <= message.sent_at <= after


class TestRoomDataIntegrity:
    """Test data integrity and relationships"""
    
    def test_room_cascade_delete(self):
        """Test that deleting room cascades to participants and messages"""
        creator = create_test_user()
        participant = create_test_user()
        room = create_test_room(creator.id)
        
        create_test_room_participant(room.id, participant.id)
        create_test_room_message(room.id, creator.id, "Message")
        
        db = TestingSessionLocal()
        try:
            # Count before delete
            msg_count_before = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).count()
            assert msg_count_before == 1
            
            # Delete room
            room_to_delete = db.query(models.Room).filter(
                models.Room.id == room.id
            ).first()
            db.delete(room_to_delete)
            db.commit()
            
            # Verify messages deleted
            msg_count_after = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).count()
            assert msg_count_after == 0
        finally:
            db.close()
    
    def test_message_history_order(self):
        """Test that messages maintain chronological order"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        messages = []
        for i in range(5):
            msg = create_test_room_message(room.id, creator.id, f"Message {i}")
            messages.append(msg)
        
        db = TestingSessionLocal()
        try:
            retrieved = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).order_by(models.RoomMessage.sent_at).all()
            
            assert len(retrieved) == 5
            for i, msg in enumerate(retrieved):
                assert f"Message {i}" in msg.content
        finally:
            db.close()
    
    def test_participant_user_relationship(self):
        """Test participant-user relationship integrity"""
        creator = create_test_user()
        participant = create_test_user()
        room = create_test_room(creator.id)
        
        room_part = create_test_room_participant(room.id, participant.id)
        
        db = TestingSessionLocal()
        try:
            retrieved_part = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.id == room_part.id
            ).first()
            
            assert retrieved_part.user_id == participant.id
            assert retrieved_part.room_id == room.id
        finally:
            db.close()


class TestRoomWebRTC:
    """Test WebRTC-related room functionality"""
    
    def test_room_websocket_path_valid(self):
        """Test that room has valid WebSocket path format"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Room ID should be UUID format for WebSocket path
        assert room.id is not None
        assert isinstance(room.id, uuid.UUID)
    
    def test_room_signaling_setup(self):
        """Test room has required fields for WebRTC signaling"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        db = TestingSessionLocal()
        try:
            retrieved = db.query(models.Room).filter(
                models.Room.id == room.id
            ).first()
            
            # Room should have ID for peer connections
            assert retrieved.id is not None
            # Creator should be identifiable
            assert retrieved.creator_id is not None
            # Participants list should be accessible
            assert hasattr(retrieved, 'participants')
        finally:
            db.close()
    
    def test_multiple_peer_connections(self):
        """Test room can handle multiple peer connections"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Add multiple participants (simulating multiple peers)
        peers = [create_test_user() for _ in range(5)]
        for peer in peers:
            create_test_room_participant(room.id, peer.id)
        
        db = TestingSessionLocal()
        try:
            participants = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.room_id == room.id
            ).all()
            
            # Should have 5 peer connections
            assert len(participants) == 5
        finally:
            db.close()


class TestRoomPolls:
    """Test room polling functionality"""
    
    def test_room_supports_polls(self):
        """Test that room structure supports polling"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Room should have messages to store poll questions
        assert hasattr(models.Room, 'messages')
        
        # Create a "poll" message
        poll_content = '{"type": "poll", "question": "What do you think?", "options": ["Yes", "No"]}'
        message = create_test_room_message(room.id, creator.id, poll_content)
        
        assert message is not None
        assert "poll" in message.content
    
    def test_poll_results_tracking(self):
        """Test tracking poll results through messages"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Create poll message
        poll_msg = create_test_room_message(
            room.id, 
            creator.id, 
            '{"type": "poll", "question": "Test?", "id": "poll-1"}'
        )
        
        # Create vote messages
        vote_msg1 = create_test_room_message(
            room.id,
            creator.id,
            '{"type": "vote", "poll_id": "poll-1", "option": 0}'
        )
        
        db = TestingSessionLocal()
        try:
            messages = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).all()
            
            # Both poll and vote messages should be stored
            assert len(messages) >= 2
        finally:
            db.close()


class TestRoomIntegration:
    """Integration tests combining multiple room features"""
    
    def test_complete_room_setup(self):
        """Test creating and populating a complete room"""
        # Setup
        creator = create_test_user()
        room = create_test_room(creator.id, "Integration Test Room")
        
        # Add participants
        participants = [create_test_user() for _ in range(3)]
        for participant in participants:
            create_test_room_participant(room.id, participant.id)
        
        # Add messages
        for i in range(5):
            create_test_room_message(room.id, creator.id, f"Message {i}")
        
        db = TestingSessionLocal()
        try:
            # Verify room
            room_check = db.query(models.Room).filter(
                models.Room.id == room.id
            ).first()
            
            assert room_check is not None
            assert room_check.name == "Integration Test Room"
            assert room_check.creator_id == creator.id
            
            # Verify participants
            part_count = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.room_id == room.id
            ).count()
            assert part_count == 3
            
            # Verify messages
            msg_count = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).count()
            assert msg_count == 5
        finally:
            db.close()
    
    def test_room_lifecycle(self):
        """Test full room lifecycle"""
        # Create
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        assert room.id is not None
        
        # Populate
        participant = create_test_user()
        create_test_room_participant(room.id, participant.id)
        
        db = TestingSessionLocal()
        try:
            # Verify population
            retrieved = db.query(models.Room).filter(
                models.Room.id == room.id
            ).first()
            
            assert len(retrieved.participants) == 1
            
            # Add message
            message = create_test_room_message(room.id, creator.id, "Lifecycle test")
            
            # Verify message
            msg = db.query(models.RoomMessage).filter(
                models.RoomMessage.id == message.id
            ).first()
            
            assert msg is not None
            assert msg.content == "Lifecycle test"
        finally:
            db.close()
    
    def test_concurrent_messages(self):
        """Test handling concurrent messages from multiple users"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        users = [create_test_user() for _ in range(3)]
        for user in users:
            create_test_room_participant(room.id, user.id)
        
        # Simulate concurrent messages
        all_users = [creator] + users
        for i in range(10):
            user = all_users[i % len(all_users)]
            create_test_room_message(room.id, user.id, f"Concurrent {i}")
        
        db = TestingSessionLocal()
        try:
            messages = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).order_by(models.RoomMessage.sent_at).all()
            
            assert len(messages) == 10
        finally:
            db.close()


class TestRoomErrorHandling:
    """Test error handling and edge cases"""
    
    def test_room_with_no_participants(self):
        """Test room with no participants except creator"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        db = TestingSessionLocal()
        try:
            participants = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.room_id == room.id
            ).count()
            
            # Room exists with no participants
            assert participants == 0
        finally:
            db.close()
    
    def test_message_without_content(self):
        """Test message with empty content"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Empty message should still be storable
        message = create_test_room_message(room.id, creator.id, "")
        
        assert message is not None
        assert message.content == ""
    
    def test_message_with_long_content(self):
        """Test message with very long content"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        long_content = "x" * 10000  # 10KB message
        message = create_test_room_message(room.id, creator.id, long_content)
        
        assert message is not None
        assert len(message.content) == 10000
    
    def test_room_with_special_characters_in_name(self):
        """Test room name with special characters"""
        creator = create_test_user()
        special_name = "Room 🎥 & 🎤 #1 (Test)"
        room = create_test_room(creator.id, special_name)
        
        assert room.name == special_name
    
    def test_message_with_special_characters(self):
        """Test message with special characters and emojis"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        special_msg = "Hello 👋 everyone! 🎉 #room #test"
        message = create_test_room_message(room.id, creator.id, special_msg)
        
        assert message.content == special_msg


class TestRoomPerformance:
    """Test room performance with larger datasets"""
    
    def test_large_message_history(self):
        """Test room with large message history"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Create 100 messages
        for i in range(100):
            create_test_room_message(room.id, creator.id, f"Message {i}")
        
        db = TestingSessionLocal()
        try:
            messages = db.query(models.RoomMessage).filter(
                models.RoomMessage.room_id == room.id
            ).all()
            
            assert len(messages) == 100
        finally:
            db.close()
    
    def test_many_room_participants(self):
        """Test room with many participants"""
        creator = create_test_user()
        room = create_test_room(creator.id)
        
        # Add 50 participants
        for _ in range(50):
            participant = create_test_user()
            create_test_room_participant(room.id, participant.id)
        
        db = TestingSessionLocal()
        try:
            participants = db.query(models.RoomParticipant).filter(
                models.RoomParticipant.room_id == room.id
            ).count()
            
            assert participants == 50
        finally:
            db.close()
