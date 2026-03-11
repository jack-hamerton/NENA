from services.firebase_service import FirebaseService

class AuthService:
    def __init__(self):
        self.firebase = FirebaseService()

    def signup(self, data):
        """Register a new user."""
        if not data.get('email') or not data.get('password') or not data.get('username'):
            return {"success": False, "message": "Email, password, and username are required"}, 400
        
        # In a real Firebase app, we'd use firebase_admin to create the user
        # For now, we use our simulation in FirebaseService
        user = self.firebase.create_user(data)
        return {"success": True, "user": user}, 201

    def login(self, data):
        """Log in a user."""
        # For Firebase, login is typically handled on the frontend.
        # This endpoint might be used to verify a token and return user data.
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return {"success": False, "message": "Email and password are required"}, 400
            
        # Simulate finding user by email
        for user_id, user in self.firebase._users.items():
            if user['email'] == email:
                # In real app, verify password or use firebase client SDK on frontend
                return {
                    "success": True, 
                    "token": user['id'], # For dummy, user_id is the token
                    "user": user
                }, 200
                
        return {"success": False, "message": "Invalid credentials"}, 401

    def get_current_user(self, id_token):
        """Verify token and return user details."""
        decoded = self.firebase.verify_token(id_token)
        if not decoded:
            return None
            
        return self.firebase.get_user(decoded['uid'])
