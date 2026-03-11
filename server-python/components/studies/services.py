from services.firebase_service import FirebaseService

class StudyService:
    def __init__(self):
        self.firebase = FirebaseService()

    def get_all_sessions(self):
        # In a real app, this would use self.firebase.fetch_collection('studies')
        return [
            {
                "id": "study_1",
                "title": "Quantum Physics Basics",
                "description": "Introduction to quantum mechanics",
                "hostId": "user_1",
                "isLive": True,
                "participantsCount": 12
            }
        ]

    def create_session(self, data):
        print(f"Creating study session: {data.get('title')}")
        return {"id": "new_study_id", **data}

    def get_session_by_id(self, session_id):
        return {
            "id": session_id,
            "title": "Sample Study Session",
            "materials": []
        }
