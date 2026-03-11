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

    def fetch_posts(self):
        # Simulate fetching posts from Firestore
        return [
            {
                "id": "post_1",
                "authorId": "user_1",
                "authorName": "Alice Wambui",
                "authorUsername": "alice_w",
                "authorAvatar": "/avatars/alice.png",
                "title": "Welcome to NENA",
                "content": "This is our new real-time post feed. Feel free to share your thoughts! #welcome #nena",
                "likesCount": 15,
                "dislikesCount": 1,
                "commentsCount": 2,
                "sharesCount": 5,
                "createdAt": datetime.now().isoformat(),
                "mediaUrl": None,
                "hashtags": ["welcome", "nena"],
                "isLiked": False
            },
            {
                "id": "post_2",
                "authorId": "user_2",
                "authorName": "Bob Otieno",
                "authorUsername": "bob_o",
                "authorAvatar": "/avatars/bob.png",
                "title": "AI in Coding",
                "content": "What are your favorite tools for AI-assisted development? #ai #coding",
                "likesCount": 42,
                "dislikesCount": 0,
                "commentsCount": 5,
                "sharesCount": 12,
                "createdAt": datetime.now().isoformat(),
                "mediaUrl": "https://example.com/ai-image.jpg",
                "hashtags": ["ai", "coding"],
                "isLiked": True
            }
        ]

    def create_post(self, data):
        # Simulate saving a post to Firestore
        post = {
            "id": f"post_{int(time.time())}",
            "authorId": data['authorId'],
            "authorName": "Current User",
            "authorUsername": "current_u",
            "authorAvatar": None,
            "title": data['title'],
            "content": data['content'],
            "likesCount": 0,
            "dislikesCount": 0,
            "commentsCount": 0,
            "sharesCount": 0,
            "createdAt": datetime.now().isoformat(),
            "mediaUrl": data.get('mediaUrl'),
            "hashtags": [],
            "isLiked": False
        }
        print(f"Created post: {post['title']}")
        return post

    def like_post(self, post_id, user_id):
        # Simulate updating like count in Firestore
        print(f"User {user_id} liked post {post_id}")
        return True

    def fetch_comments(self, post_id):
        # Simulate fetching comments (flat list, nesting handled via parentId)
        return [
            {
                "id": "comment_1",
                "postId": post_id,
                "authorId": "user_3",
                "authorName": "Jane Smith",
                "authorUsername": "jane_s",
                "authorAvatar": None,
                "content": "Great post! Really looking forward to exploring this.",
                "createdAt": datetime.now().isoformat(),
                "parentId": None,
                "likesCount": 5,
                "dislikesCount": 0,
                "isLiked": False
            },
            {
                "id": "comment_2",
                "postId": post_id,
                "authorId": "user_4",
                "authorName": "John Doe",
                "authorUsername": "john_d",
                "authorAvatar": None,
                "content": "I agree with Jane!",
                "createdAt": datetime.now().isoformat(),
                "parentId": "comment_1",
                "likesCount": 2,
                "dislikesCount": 0,
                "isLiked": True
            }
        ]

    def create_comment(self, data):
        # Simulate creating a comment/reply
        comment = {
            "id": f"comment_{int(time.time())}",
            "postId": data['postId'],
            "authorId": data['authorId'],
            "authorName": "Current User",
            "authorUsername": "current_u",
            "authorAvatar": None,
            "content": data['content'],
            "createdAt": datetime.now().isoformat(),
            "parentId": data.get('parentId'),
            "likesCount": 0,
            "dislikesCount": 0,
            "isLiked": False
        }
        print(f"Created comment for post {data['postId']} (parent: {data.get('parentId')})")
        return comment

    def like_comment(self, comment_id, user_id):
        # Simulate liking a comment
        print(f"User {user_id} liked comment {comment_id}")
        return True
