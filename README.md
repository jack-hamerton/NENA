# Nena Platform

This is a full-stack application with a React frontend and a Python backend.

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
* Python 3.11
* Docker

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/your_project_name.git
   ```
2. Install NPM packages
   ```sh
   cd frontend && npm install
   ```
3. Install Python packages
   ```sh
   source .venv/bin/activate && cd backend && pip install -r requirements.txt
   ```

## Usage

### Without Docker

1. Start the backend server
   ```sh
   source .venv/bin/activate && export PYTHONPATH=$PYTHONPATH:$(pwd)/database && cd backend && uvicorn app.main:app --reload
   ```
2. Start the frontend development server
   ```sh
   cd frontend && npm start
   ```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### With Docker

1. Build and run the containers
   ```sh
   docker-compose -f nena-platform/docker-compose.core.yml up -d --build
   ```

Open [http://localhost:80](http://localhost:80) to view it in the browser.

## Tamper-Proof Audit Log

This application includes a dedicated microservice for creating a tamper-proof audit log. All significant events that occur within the application can be recorded in an immutable, cryptographically-chained log. This ensures a high level of security and accountability, as any attempt to tamper with the log will be immediately detectable.

### Architecture

The audit system consists of two main parts:

1.  **Audit Service (`backend/app/services/audit_service.py`)**: A service within the main backend application that provides a simple function (`create_audit_event`) for sending audit events to a Kafka topic.
2.  **Audit Log Service (`audit_service/`)**: A dedicated Python microservice that:
    *   Consumes events from the `audit_log_events` Kafka topic.
    *   Creates a "chained" log entry where each new record contains the hash of the previous one.
    *   Stores the immutable log in `audit_service/audit_log.jsonl`.

This design ensures that event logging is decoupled from the main application flow and that the resulting log is secure and verifiable.

### How to Add New Audit Events

To log a new event, import the `audit_service` in the backend and call the `create_audit_event` function.

**Example:**
```python
# In any backend service file where you want to log an action
from app.services import audit_service

def some_important_function(user_id: str, data: dict):
    # ... function logic ...

    # Log the event
    audit_service.create_audit_event(
        actor=user_id,
        action="important.function.executed",
        details={"input_data": data, "message": "An important function was executed."}
    )

    # ... rest of the function ...
```

## Production

To run the application in a production environment:

```sh
docker-compose -f docker-compose.prod.yml up -d --build
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
