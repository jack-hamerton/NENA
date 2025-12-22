
from fastapi import Depends, FastAPI, APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.endpoints import notifications as notifications_router
from app.api.endpoints import podcasts as podcasts_router
from app.api.endpoints import webrtc as webrtc_router
from app.ai.services import ai_service
from app.reminders import start_scheduler
from app import crud, models, schemas
from app.db.session import SessionLocal

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Placeholder for user authentication
def get_current_user():
    # In a real application, this would be implemented using OAuth2 or similar
    return models.User(id=1, username="testuser")

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, client_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = {}

        # Notify existing users about the new user
        await self.broadcast_to_others(json.dumps({"type": "new-peer", "peerId": client_id}), room_id, client_id)

        # Notify the new user about existing users
        existing_peers = list(self.active_connections[room_id].keys())
        await websocket.send_text(json.dumps({"type": "existing-peers", "peerIds": existing_peers}))

        self.active_connections[room_id][client_id] = websocket

    async def disconnect(self, room_id: str, client_id: str):
        if client_id in self.active_connections.get(room_id, {}):
            del self.active_connections[room_id][client_id]
            await self.broadcast(json.dumps({"type": "peer-left", "peerId": client_id}), room_id)

    async def broadcast(self, message: str, room_id: str):
        for client_id, connection in self.active_connections.get(room_id, {}).items():
            await connection.send_text(message)

    async def broadcast_to_others(self, message: str, room_id: str, sender_id: str):
        for client_id, connection in self.active_connections.get(room_id, {}).items():
            if client_id != sender_id:
                await connection.send_text(message)

    async def send_to_peer(self, message: str, room_id: str, peer_id: str):
        if peer_id in self.active_connections.get(room_id, {}):
            await self.active_connections[room_id][peer_id].send_text(message)

manager = ConnectionManager()

@app.websocket("/api/ws/{room_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, client_id: str):
    await manager.connect(websocket, room_id, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message.get("type") in ["webrtc_offer", "webrtc_answer", "webrtc_ice_candidate"]:
                await manager.send_to_peer(data, room_id, message["to"])
            else:
                await manager.broadcast(data, room_id)
    except WebSocketDisconnect:
        await manager.disconnect(room_id, client_id)


# Create a new router for AI-specific endpoints
ai_router = APIRouter()

@ai_router.post("/self-learn", status_code=200)
def run_ai_learning_cycle():
    """
    Triggers a full self-improvement cycle for the AI.

    The AI will:
    1.  Generate a coding challenge for itself.
    2.  Attempt to write a solution.
    3.  Evaluate its own solution for correctness (AI Judge).
    4.  Update its internal parameters based on the outcome.
    """
    feedback = ai_service.run_self_improvement_cycle(domain="coding")
    return {"status": "AI self-improvement cycle completed.", "feedback": feedback}

@app.on_event("startup")
def startup_event():
    start_scheduler()

messaging_router = APIRouter()

@messaging_router.post("/conversations/", response_model=schemas.Conversation)
def create_conversation(conversation: schemas.ConversationCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_conversation(db=db, conversation=conversation, creator_id=current_user.id)

@messaging_router.get("/conversations/{conversation_id}", response_model=schemas.Conversation)
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    return crud.get_conversation(db=db, conversation_id=conversation_id)

@messaging_router.get("/users/{user_id}/conversations/", response_model=list[schemas.Conversation])
def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    return crud.get_conversations_for_user(db=db, user_id=user_id)

@messaging_router.post("/conversations/{conversation_id}/messages/", response_model=schemas.Message)
def create_message(conversation_id: int, message: schemas.MessageCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_message(db=db, message=message, conversation_id=conversation_id, sender_id=current_user.id)

room_router = APIRouter()

@room_router.post("/rooms/", response_model=schemas.Room)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_room(db=db, room=room, creator_id=current_user.id)

@room_router.get("/rooms/", response_model=List[schemas.Room])
def get_my_rooms(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_user_rooms(db=db, user_id=current_user.id)

@room_router.delete("/rooms/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    room = crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this room")
    return crud.delete_room(db=db, room_id=room_id)

@room_router.post("/rooms/{room_id}/participants/{username}")
def add_user_to_room(room_id: int, username: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    room = crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add users to this room")
    return crud.add_user_to_room(db=db, room_id=room_id, username=username)

@room_router.delete("/rooms/{room_id}/participants/{user_id}")
def remove_user_from_room(room_id: int, user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    room = crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != current_user.id and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to remove this user")
    return crud.remove_user_from_room(db=db, room_id=room_id, user_id=user_id)

poll_router = APIRouter()

@poll_router.post("/rooms/{room_id}/polls/", response_model=schemas.Poll)
def create_poll(room_id: int, poll: schemas.PollCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    room = crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to create a poll in this room")
    return crud.create_poll(db=db, poll=poll, room_id=room_id, creator_id=current_user.id)

@poll_router.get("/rooms/{room_id}/polls/", response_model=List[schemas.Poll])
def get_room_polls(room_id: int, db: Session = Depends(get_db)):
    return crud.get_polls_for_room(db=db, room_id=room_id)

@poll_router.post("/polls/{poll_id}/vote/", response_model=schemas.PollOption)
def vote_on_poll(poll_id: int, vote: schemas.VoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    poll = crud.get_poll(db, poll_id)
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return crud.vote(db=db, poll_option_id=vote.poll_option_id, user_id=current_user.id)


app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router.router, prefix="/notifications", tags=["notifications"])
app.include_router(podcasts_router.router, prefix="/api/podcasts", tags=["podcasts"])
app.include_router(ai_router, prefix="/ai")
app.include_router(messaging_router, prefix="/api/messages", tags=["messages"])
app.include_router(webrtc_router.router, prefix="/api/webrtc", tags=["webrtc"])
app.include_router(room_router, prefix="/api", tags=["rooms"])
app.include_router(poll_router, prefix="/api", tags=["polls"])
