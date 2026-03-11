from flask import Blueprint, request, jsonify
from .services import CommunicationService

communication_bp = Blueprint('communication', __name__)
service = CommunicationService()

@communication_bp.route('/messages', methods=['GET'])
def get_messages():
    sender_id = request.args.get('senderId')
    receiver_id = request.args.get('receiverId')
    
    if not sender_id or not receiver_id:
        return jsonify({"error": "senderId and receiverId are required"}), 400
        
    messages = service.get_messages(sender_id, receiver_id)
    return jsonify(messages)

@communication_bp.route('/messages', methods=['POST'])
def send_message():
    data = request.json
    if not data or 'content' not in data or 'senderId' not in data or 'receiverId' not in data:
        return jsonify({"error": "Invalid message data"}), 400
        
    message = service.send_message(data)
    return jsonify(message), 201

@communication_bp.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({"error": "userId is required"}), 400
        
    conversations = service.get_conversations(user_id)
    return jsonify(conversations)
