from flask import Blueprint, request, jsonify
from .services import AuthService
from .decorators import login_required

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    result, status_code = auth_service.login(data)
    return jsonify(result), status_code

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    result, status_code = auth_service.signup(data)
    return jsonify(result), status_code

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"success": True}), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def get_me():
    return jsonify({"success": True, "user": request.user}), 200
