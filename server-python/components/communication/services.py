from services.firebase_service import FirebaseService

class CommunicationService:
    def __init__(self):
        self.firebase = FirebaseService()

    def get_messages(self, sender_id, receiver_id):
        return self.firebase.fetch_messages(sender_id, receiver_id)

    def send_message(self, data):
        return self.firebase.save_message(data)

    def get_conversations(self, user_id):
        return self.firebase.fetch_conversations(user_id)
