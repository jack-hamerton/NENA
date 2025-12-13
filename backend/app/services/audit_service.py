import json
from datetime import datetime
import hashlib
import kafka

# Configure Kafka producer
# In a real application, get these from a config file.
KAFKA_BOOTSTRAP_SERVERS = 'kafka:9092'
AUDIT_TOPIC = 'audit_log_events'

producer = kafka.KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def get_iso_timestamp():
    """Returns the current time in ISO 8601 format."""
    return datetime.utcnow().isoformat()

def create_audit_event(actor: str, action: str, details: dict, service: str = "backend"):
    """
    Creates and sends an audit event to the Kafka topic.

    Args:
        actor: The user, service, or entity performing the action.
        action: A description of the action (e.g., 'user.login', 'database.migration').
        details: A dictionary with context about the action.
        service: The name of the service originating the event.
    """
    event = {
        "timestamp": get_iso_timestamp(),
        "service": service,
        "actor": actor,
        "action": action,
        "details": details,
    }

    # Send the event to Kafka
    producer.send(AUDIT_TOPIC, event)
    producer.flush()

# Example of how to use this service from another part of the backend:
# from . import audit_service
#
# def some_function_that_needs_auditing(user_id: str):
#     # ... your function's logic ...
#     audit_service.create_audit_event(
#         actor=user_id,
#         action="some.action.performed",
#         details={"key": "value", "description": "User performed a sensitive action."}
#     )
