from functools import wraps
from flask import request, jsonify
from .services import AuthService

auth_service = AuthService()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"success": False, "message": "Missing or invalid Authorization header"}), 401
            
        id_token = auth_header.split('Bearer ')[1]
        user = auth_service.get_current_user(id_token)
        
        if not user:
            return jsonify({"success": False, "message": "Unauthorized"}), 401
            
        # Add user to request for use in route
        request.user = user
        return f(*args, **kwargs)
    return decorated_function
