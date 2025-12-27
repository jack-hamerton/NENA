
import asyncio
import websockets
from y_py import YDoc, YMessageType, encode_state_as_update, apply_update
from app.crud.crud_document import get_or_create, update_document_content
from app.core.deps import get_db

# In-memory store for documents and their connected clients
rooms = {}

class Room:
    def __init__(self, document_id):
        self.doc = YDoc()
        self.clients = set()
        self.document_id = document_id
        # Load initial content from the database when the room is created
        with get_db() as db:
            document = get_or_create(db, document_id=document_id)
            if document.content:
                # If there is content, we should apply it as an update to the YDoc
                # This requires converting the stored content (e.g., text) into a Yjs update
                # For simplicity, we will skip this step and start with an empty document
                # In a real application, you would need a more sophisticated way to handle this
                pass

    async def add_client(self, websocket):
        self.clients.add(websocket)
        # Send the current document state to the new client
        update = encode_state_as_update(self.doc)
        await websocket.send(update)

    async def remove_client(self, websocket):
        self.clients.remove(websocket)
        # If the room is empty, persist the document and remove the room from memory
        if not self.clients:
            with get_db() as db:
                # The content needs to be extracted from the YDoc
                # This is a simplification; you might need to serialize the YDoc to a specific format
                content_to_save = self.doc.get_string("codemirror") # Assuming a Y.Text type named 'codemirror'
                update_document_content(db, document_id=self.document_id, content=content_to_save)
            del rooms[self.document_id]

    async def broadcast(self, message, sender):
        for client in self.clients:
            if client != sender:
                await client.send(message)

async def handle_connection(websocket, path):
    document_id = path.strip('/')
    
    if document_id not in rooms:
        rooms[document_id] = Room(document_id)
    
    room = rooms[document_id]
    await room.add_client(websocket)

    try:
        async for message in websocket:
            # Apply the update to the server's YDoc
            apply_update(room.doc, message)
            # Broadcast the update to other clients
            await room.broadcast(message, websocket)
    finally:
        await room.remove_client(websocket)

async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    print("Starting collaboration server on ws://localhost:8765")
    asyncio.run(main())
