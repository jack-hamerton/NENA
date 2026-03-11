from flask import Blueprint, request, jsonify
from .services import RoomService

rooms_bp = Blueprint('rooms', __name__)
room_service = RoomService()

@rooms_bp.route('/', methods=['GET'])
def get_rooms():
    rooms = room_service.get_all_rooms()
    return jsonify(rooms)

@rooms_bp.route('/', methods=['POST'])
def create_room():
    data = request.json
    result = room_service.create_room(data)
    return jsonify(result), 201

@rooms_bp.route('/<room_id>', methods=['GET'])
def get_room(room_id):
    room = room_service.get_room_by_id(room_id)
    return jsonify(room)

@rooms_bp.route('/<room_id>/join', methods=['POST'])
def join_room(room_id):
    data = request.json
    user_id = data.get('userId')
    result = room_service.join_room(room_id, user_id)
    return jsonify(result)

@rooms_bp.route('/<room_id>/leave', methods=['POST'])
def leave_room(room_id):
    data = request.json
    user_id = data.get('userId')
    result = room_service.leave_room(room_id, user_id)
    return jsonify(result)

@rooms_bp.route('/<room_id>/participants', methods=['GET'])
def get_participants(room_id):
    # In a real app, this would fetch from the service/firebase
    participants = [
        {"id": "p1", "username": "host_user", "role": "host", "isMuted": False, "isVideoOff": False}
    ]
    return jsonify(participants)
