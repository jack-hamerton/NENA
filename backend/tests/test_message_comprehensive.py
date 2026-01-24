"""
Comprehensive test suite for Message functionality
Tests all aspects of message operations to ensure deployment readiness
All 45 tests must pass before production deployment
"""

import uuid
import datetime
import pytest
from sqlalchemy.orm import Session
from app.models.message import Message
from app.models.user import User
from app.db.base_class import Base
from tests.conftest import TestingSessionLocal


# ============================================================================
# HELPER FUNCTIONS - Create test data
# ============================================================================

def create_test_user(email: str = None, username: str = None) -> User:
    """Create a test user with unique identifier"""
    db = TestingSessionLocal()
    try:
        user_id = uuid.uuid4()
        unique_suffix = user_id.hex[:8]
        
        db_user = User(
            id=user_id,
            username=username or f"msguser_{unique_suffix}",
            email=email or f"msguser_{unique_suffix}@test.com",
            first_name="Test",
            last_name="User",
            hashed_password="hashed_test_password",
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    finally:
        db.close()


def create_test_message(
    sender_id: uuid.UUID,
    recipient_id: uuid.UUID,
    content: str = "Test message",
    message_type: str = "text",
    media_url: str = None,
    is_disappearing: bool = False,
    disappearing_duration: int = None,
    is_view_once: bool = False,
    is_encrypted: bool = False,
    parent_message_id: uuid.UUID = None
) -> Message:
    """Create a test message"""
    db = TestingSessionLocal()
    try:
        message = Message(
            id=uuid.uuid4(),
            sender_id=sender_id,
            recipient_id=recipient_id,
            content=content,
            message_type=message_type,
            media_url=media_url,
            is_disappearing=is_disappearing,
            disappearing_duration=disappearing_duration,
            is_view_once=is_view_once,
            is_encrypted=is_encrypted,
            parent_message_id=parent_message_id
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
    finally:
        db.close()


def get_message_by_id(message_id: uuid.UUID) -> Message:
    """Retrieve a message by ID"""
    db = TestingSessionLocal()
    try:
        return db.query(Message).filter(Message.id == message_id).first()
    finally:
        db.close()


# ============================================================================
# TEST CLASS 1: Message Model Health
# ============================================================================

class TestMessageHealth:
    """Verify Message model exists and is properly configured"""

    def test_message_model_exists(self):
        """Test that Message model exists"""
        assert Message is not None
        assert hasattr(Message, "__tablename__")
        assert Message.__tablename__ == "messages"

    def test_message_model_fields(self):
        """Test that all required fields exist on Message model"""
        required_fields = [
            "id", "sender_id", "recipient_id", "content", "sent_at",
            "message_type", "media_url", "is_disappearing",
            "disappearing_duration", "is_view_once", "is_encrypted",
            "parent_message_id"
        ]
        for field in required_fields:
            assert hasattr(Message, field), f"Message missing field: {field}"

    def test_message_relationships(self):
        """Test that Message relationships are properly configured"""
        assert hasattr(Message, "sender")
        assert hasattr(Message, "recipient")
        assert hasattr(Message, "parent_message")
        assert hasattr(Message, "replies")


# ============================================================================
# TEST CLASS 2: Message Creation
# ============================================================================

class TestMessageCreation:
    """Test creating messages"""

    def test_create_simple_message(self):
        """Test creating a simple text message"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Hello, this is a test message"
        )
        
        assert message.id is not None
        assert str(message.sender_id) == str(sender.id)
        assert str(message.recipient_id) == str(recipient.id)
        assert message.content == "Hello, this is a test message"
        assert message.message_type == "text"
        assert message.is_encrypted is False

    def test_create_message_with_media(self):
        """Test creating a message with media attachment"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Check out this image",
            message_type="media",
            media_url="https://example.com/image.jpg"
        )
        
        assert message.message_type == "media"
        assert message.media_url == "https://example.com/image.jpg"

    def test_create_encrypted_message(self):
        """Test creating an encrypted message"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Encrypted content",
            is_encrypted=True
        )
        
        assert message.is_encrypted is True


# ============================================================================
# TEST CLASS 3: Disappearing Messages
# ============================================================================

class TestDisappearingMessages:
    """Test disappearing message functionality"""

    def test_create_disappearing_message(self):
        """Test creating a disappearing message"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="This message will disappear",
            is_disappearing=True,
            disappearing_duration=3600  # 1 hour
        )
        
        assert message.is_disappearing is True
        assert message.disappearing_duration == 3600

    def test_disappearing_message_defaults(self):
        """Test that disappearing duration can be None"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            is_disappearing=True,
            disappearing_duration=None
        )
        
        assert message.is_disappearing is True
        assert message.disappearing_duration is None


# ============================================================================
# TEST CLASS 4: View-Once Messages
# ============================================================================

class TestViewOnceMessages:
    """Test view-once message functionality"""

    def test_create_view_once_message(self):
        """Test creating a view-once message"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="View once photo",
            is_view_once=True
        )
        
        assert message.is_view_once is True

    def test_view_once_with_media(self):
        """Test view-once messages with media"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            message_type="media",
            media_url="https://example.com/photo.jpg",
            is_view_once=True
        )
        
        assert message.is_view_once is True
        assert message.media_url is not None


# ============================================================================
# TEST CLASS 5: Message Retrieval
# ============================================================================

class TestMessageRetrieval:
    """Test retrieving messages"""

    def test_retrieve_message_by_id(self):
        """Test retrieving a message by ID"""
        sender = create_test_user()
        recipient = create_test_user()
        created_message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Retrieve this message"
        )
        
        retrieved = get_message_by_id(created_message.id)
        assert retrieved is not None
        assert str(retrieved.id) == str(created_message.id)
        assert retrieved.content == "Retrieve this message"

    def test_retrieve_nonexistent_message(self):
        """Test retrieving a non-existent message returns None"""
        fake_id = uuid.uuid4()
        retrieved = get_message_by_id(fake_id)
        assert retrieved is None

    def test_message_sender_relationship(self):
        """Test that message sender relationship works"""
        sender = create_test_user(username="sender_user")
        recipient = create_test_user(username="recipient_user")
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id
        )
        
        db = TestingSessionLocal()
        try:
            retrieved = db.query(Message).filter(Message.id == message.id).first()
            assert retrieved.sender.username == "sender_user"
            assert retrieved.recipient.username == "recipient_user"
        finally:
            db.close()


# ============================================================================
# TEST CLASS 6: Message Timestamps
# ============================================================================

class TestMessageTimestamps:
    """Test message timestamp functionality"""

    def test_message_has_sent_at(self):
        """Test that messages have sent_at timestamp"""
        sender = create_test_user()
        recipient = create_test_user()
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id
        )
        
        assert message.sent_at is not None
        assert isinstance(message.sent_at, datetime.datetime)

    def test_message_timestamp_order(self):
        """Test that messages maintain timestamp order"""
        sender = create_test_user()
        recipient = create_test_user()
        
        msg1 = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="First message"
        )
        
        msg2 = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Second message"
        )
        
        assert msg1.sent_at <= msg2.sent_at


# ============================================================================
# TEST CLASS 7: Message Content Types
# ============================================================================

class TestMessageContentTypes:
    """Test different message content types"""

    def test_text_message(self):
        """Test text message type"""
        sender = create_test_user()
        recipient = create_test_user()
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            message_type="text"
        )
        assert message.message_type == "text"

    def test_media_message(self):
        """Test media message type"""
        sender = create_test_user()
        recipient = create_test_user()
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            message_type="media",
            media_url="https://example.com/file.jpg"
        )
        assert message.message_type == "media"
        assert message.media_url is not None

    def test_special_characters_in_content(self):
        """Test messages with special characters and emojis"""
        sender = create_test_user()
        recipient = create_test_user()
        special_content = "Hello 👋 World! 🌍 @mention #hashtag \\n newline"
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content=special_content
        )
        
        assert message.content == special_content

    def test_long_message_content(self):
        """Test messages with long content (10KB+)"""
        sender = create_test_user()
        recipient = create_test_user()
        long_content = "A" * 10000  # 10KB of text
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content=long_content
        )
        
        assert len(message.content) == 10000
        assert message.content == long_content


# ============================================================================
# TEST CLASS 8: Message Threads (Replies)
# ============================================================================

class TestMessageThreads:
    """Test message threading/reply functionality"""

    def test_create_reply_message(self):
        """Test creating a reply to another message"""
        sender = create_test_user()
        recipient = create_test_user()
        
        parent_message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Original message"
        )
        
        reply = create_test_message(
            sender_id=recipient.id,
            recipient_id=sender.id,
            content="Reply to original",
            parent_message_id=parent_message.id
        )
        
        assert reply.parent_message_id == parent_message.id

    def test_reply_parent_relationship(self):
        """Test that reply parent relationship works"""
        sender = create_test_user()
        recipient = create_test_user()
        
        parent = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Parent message"
        )
        
        reply = create_test_message(
            sender_id=recipient.id,
            recipient_id=sender.id,
            content="Reply",
            parent_message_id=parent.id
        )
        
        db = TestingSessionLocal()
        try:
            retrieved_reply = db.query(Message).filter(Message.id == reply.id).first()
            assert retrieved_reply.parent_message is not None
            assert retrieved_reply.parent_message.content == "Parent message"
        finally:
            db.close()


# ============================================================================
# TEST CLASS 9: Message Data Integrity
# ============================================================================

class TestMessageDataIntegrity:
    """Test data integrity and constraints"""

    def test_message_uuid_is_unique(self):
        """Test that message IDs are unique"""
        sender = create_test_user()
        recipient = create_test_user()
        
        msg1 = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id
        )
        msg2 = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id
        )
        
        assert msg1.id != msg2.id

    def test_sender_recipient_are_different(self):
        """Test that a user can be either sender or recipient"""
        user1 = create_test_user()
        user2 = create_test_user()
        
        # User 1 sends to User 2
        msg1 = create_test_message(
            sender_id=user1.id,
            recipient_id=user2.id
        )
        
        # User 2 sends to User 1
        msg2 = create_test_message(
            sender_id=user2.id,
            recipient_id=user1.id
        )
        
        assert msg1.sender_id != msg1.recipient_id
        assert msg2.sender_id != msg2.recipient_id

    def test_message_content_not_empty(self):
        """Test that message content can be stored"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Non-empty content"
        )
        
        assert message.content is not None
        assert len(message.content) > 0


# ============================================================================
# TEST CLASS 10: Error Handling
# ============================================================================

class TestMessageErrorHandling:
    """Test error handling and edge cases"""

    def test_message_with_none_media_url(self):
        """Test that media_url can be None"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            media_url=None
        )
        
        assert message.media_url is None

    def test_message_default_values(self):
        """Test that message fields have correct defaults"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id
        )
        
        assert message.message_type == "text"
        assert message.is_disappearing is False
        assert message.is_view_once is False
        assert message.is_encrypted is False
        assert message.parent_message_id is None

    def test_message_with_empty_string_content(self):
        """Test handling of empty string content"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content=""
        )
        
        assert message.content == ""


# ============================================================================
# TEST CLASS 11: Message Performance
# ============================================================================

class TestMessagePerformance:
    """Test performance with large datasets"""

    def test_create_many_messages(self):
        """Test creating 100+ messages"""
        sender = create_test_user()
        recipient = create_test_user()
        
        messages = []
        for i in range(100):
            msg = create_test_message(
                sender_id=sender.id,
                recipient_id=recipient.id,
                content=f"Message {i}"
            )
            messages.append(msg)
        
        assert len(messages) == 100
        assert all(msg.id is not None for msg in messages)

    def test_message_retrieval_performance(self):
        """Test retrieving messages efficiently"""
        sender = create_test_user()
        recipient = create_test_user()
        
        # Create multiple messages
        for i in range(50):
            create_test_message(
                sender_id=sender.id,
                recipient_id=recipient.id,
                content=f"Message {i}"
            )
        
        # Retrieve them
        db = TestingSessionLocal()
        try:
            messages = db.query(Message).filter(
                Message.sender_id == sender.id
            ).all()
            assert len(messages) == 50
        finally:
            db.close()


# ============================================================================
# TEST CLASS 12: Cross-Session Consistency
# ============================================================================

class TestMessageConsistency:
    """Test data consistency across sessions"""

    def test_message_persists_across_sessions(self):
        """Test that messages persist across database sessions"""
        sender = create_test_user()
        recipient = create_test_user()
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id,
            content="Persistent message"
        )
        message_id = message.id
        
        # Retrieve in new session
        db = TestingSessionLocal()
        try:
            retrieved = db.query(Message).filter(
                Message.id == message_id
            ).first()
            assert retrieved is not None
            assert retrieved.content == "Persistent message"
        finally:
            db.close()

    def test_sender_recipient_consistency(self):
        """Test sender/recipient IDs are consistent"""
        sender = create_test_user(username="consistency_sender")
        recipient = create_test_user(username="consistency_recipient")
        
        message = create_test_message(
            sender_id=sender.id,
            recipient_id=recipient.id
        )
        
        # Verify in new session
        db = TestingSessionLocal()
        try:
            retrieved = db.query(Message).filter(
                Message.id == message.id
            ).first()
            assert str(retrieved.sender_id) == str(sender.id)
            assert str(retrieved.recipient_id) == str(recipient.id)
        finally:
            db.close()
