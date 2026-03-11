import time
from datetime import datetime

class FirebaseService:
    def __init__(self):
        # NOTE: Using dummy credentials as requested.
        # In a real app, you'd use firebase_admin.initialize_app() here.
        self.config = {
            "apiKey": "dummy-api-key",
            "authDomain": "nena-dummy.firebaseapp.com",
            "projectId": "nena-dummy",
            "storageBucket": "nena-dummy.appspot.com",
            "messagingSenderId": "123456789",
            "appId": "1:123456789:web:abcdef"
        }
        print(f"Firebase initialized with project: {self.config['projectId']}")

    def fetch_messages(self, user1_id, user2_id):
        # Simulate fetching from Firestore
        # Data models implemented as if fields already exist
        print(f"Fetching messages between {user1_id} and {user2_id}")
        return [
            {
                "id": "msg_1",
                "senderId": user1_id,
                "receiverId": user2_id,
                "content": "Hello! How can I help you today?",
                "createdAt": datetime.now().isoformat(),
                "isRead": True
            },
            {
                "id": "msg_2",
                "senderId": user2_id,
                "receiverId": user1_id,
                "content": "I'm looking for some information about the real-time forum.",
                "createdAt": datetime.now().isoformat(),
                "isRead": False
            }
        ]

    def save_message(self, data):
        # Simulate saving to Firestore
        message = {
            "id": f"msg_{int(time.time())}",
            "senderId": data['senderId'],
            "receiverId": data['receiverId'],
            "content": data['content'],
            "createdAt": datetime.now().isoformat(),
            "isRead": False
        }
        print(f"Saved message: {message['content']}")
        return message

    def fetch_conversations(self, user_id):
        # Simulate fetching conversations for the user
        return [
            {
                "id": "conv_1",
                "name": "Jane Smith",
                "lastMessage": "I'm looking for some information about the real-time forum.",
                "lastMessageAt": datetime.now().isoformat(),
                "unreadCount": 1
            },
            {
                "id": "conv_2",
                "name": "John Doe",
                "lastMessage": "See you later!",
                "lastMessageAt": datetime.now().isoformat(),
                "unreadCount": 0
            }
        ]
