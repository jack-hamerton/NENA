from services.firebase_service import FirebaseService

class RoomService:
    def __init__(self):
        self.firebase = FirebaseService()

    def get_all_rooms(self):
        return [
            {
                "id": "room_1",
                "name": "Design Thinking Workshop",
                "description": "Collaborative design session",
                "hostId": "user_2",
                "isLive": True,
                "participantsCount": 8,
                "category": "Design"
            }
        ]

    def create_room(self, data):
        print(f"Creating room: {data.get('name')}")
        return {"id": "new_room_id", **data}

    def get_room_by_id(self, room_id):
        return {
            "id": room_id,
            "name": "Sample Room",
            "hostId": "user_2",
            "isLive": True
        }

    def join_room(self, room_id, user_id):
        print(f"User {user_id} joining room {room_id}")
        return {"status": "success"}

    def leave_room(self, room_id, user_id):
        print(f"User {user_id} leaving room {room_id}")
        return {"status": "success"}
