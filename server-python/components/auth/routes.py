from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    # Mock login
    data = request.json
    username = data.get('username')
    return jsonify({
        "success": True,
        "token": "mock-jwt-token",
        "user": {
            "id": "user_123",
            "username": username,
            "email": f"{username}@example.com"
        }
    })

@auth_bp.route('/signup', methods=['POST'])
def signup():
    # Mock signup
    return jsonify({"success": True, "message": "User registered successfully"})

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"success": True})
