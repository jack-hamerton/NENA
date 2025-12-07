from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import (auth, users, posts, discover, profile, 
                                   messages, rooms, study, music, podcasts)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(posts.router, prefix="/api/v1/posts", tags=["posts"])
app.include_router(discover.router, prefix="/api/v1/discover", tags=["discover"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
app.include_router(messages.router, prefix="/api/v1/messages", tags=["messages"])
app.include_router(rooms.router, prefix="/api/v1/rooms", tags=["rooms"])
app.include_router(study.router, prefix="/api/v1/study", tags=["study"])
app.include_router(music.router, prefix="/api/v1/music", tags=["music"])
app.include_router(podcasts.router, prefix="/api/v1/podcasts", tags=["podcasts"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the NENA API"}
