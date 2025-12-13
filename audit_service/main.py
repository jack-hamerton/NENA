import json
import hashlib
import os
import smtplib
from email.mime.text import MIMEText
from kafka import KafkaConsumer

# Kafka and log file configuration
KAFKA_BOOTSTRAP_SERVERS = os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092')
AUDIT_TOPIC = 'audit_log_events'
LOG_FILE_PATH = 'audit_log.jsonl'
HASH_FILE_PATH = 'last_hash.txt'

# Email configuration from environment variables
SMTP_SERVER = os.environ.get('SMTP_SERVER')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USERNAME = os.environ.get('SMTP_USERNAME')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL')

# --- Email Function ---

def send_audit_summary_email(entry: dict):
    """Sends a summary of the audit event via email."""
    if not all([SMTP_SERVER, SMTP_USERNAME, SMTP_PASSWORD, RECIPIENT_EMAIL]):
        print("Email configuration is incomplete. Skipping email notification.")
        return

    try:
        subject = f"Audit Log Event: {entry['event']['action']}"
        body = f"""A new audit event has been recorded:

Service: {entry['event']['service']}
Actor: {entry['event']['actor']}
Action: {entry['event']['action']}
Timestamp: {entry['event']['timestamp']}
Details: {json.dumps(entry['event']['details'], indent=2)}

--- Tamper-Proof Details ---
Hash: {entry['hash']}
Previous Hash: {entry['previous_hash']}
"""

        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = SMTP_USERNAME
        msg['To'] = RECIPIENT_EMAIL

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, [RECIPIENT_EMAIL], msg.as_string())
            print(f"Sent audit summary email to {RECIPIENT_EMAIL}")

    except Exception as e:
        print(f"Failed to send email: {e}")

# --- Chain Functions ---

def get_last_hash():
    """Retrieves the last hash from the hash file."""
    if not os.path.exists(HASH_FILE_PATH):
        return hashlib.sha256(b'genesis_block').hexdigest()
    with open(HASH_FILE_PATH, 'r') as f:
        return f.read().strip()

def save_last_hash(new_hash: str):
    """Saves the latest hash to the hash file."""
    with open(HASH_FILE_PATH, 'w') as f:
        f.write(new_hash)

def create_chained_entry(event: dict, last_hash: str) -> dict:
    """
    Creates a cryptographically chained audit log entry.
    """
    entry_data = {
        "event": event,
        "previous_hash": last_hash,
    }
    current_hash = hashlib.sha256(json.dumps(entry_data, sort_keys=True).encode('utf-8')).hexdigest()
    chained_entry = {**entry_data, "hash": current_hash}
    return chained_entry

# --- Main Application Logic ---

def main():
    """The main function for the audit log service."""
    print("Starting the tamper-proof audit log service...")
    
    consumer = KafkaConsumer(
        AUDIT_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_deserializer=lambda v: json.loads(v.decode('utf-8')),
        auto_offset_reset='earliest'
    )

    last_hash = get_last_hash()
    print(f"Resuming chain with hash: {last_hash}")

    for message in consumer:
        event = message.value
        print(f"Received event: {event}")
        
        chained_entry = create_chained_entry(event, last_hash)
        print(f"Created chained entry: {chained_entry}")

        with open(LOG_FILE_PATH, 'a') as f:
            f.write(json.dumps(chained_entry) + '\n')
        
        last_hash = chained_entry['hash']
        save_last_hash(last_hash)
        print(f"New last hash: {last_hash}")

        # Send the email summary
        send_audit_summary_email(chained_entry)

if __name__ == "__main__":
    main()
