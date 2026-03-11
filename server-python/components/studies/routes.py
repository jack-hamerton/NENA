from flask import Blueprint, request, jsonify
from .services import StudyService

studies_bp = Blueprint('studies', __name__)
study_service = StudyService()

@studies_bp.route('/', methods=['GET'])
def get_sessions():
    sessions = study_service.get_all_sessions()
    return jsonify(sessions)

@studies_bp.route('/', methods=['POST'])
def create_session():
    data = request.json
    result = study_service.create_session(data)
    return jsonify(result), 201

@studies_bp.route('/<session_id>', methods=['GET'])
def get_session(session_id):
    session = study_service.get_session_by_id(session_id)
    return jsonify(session)
