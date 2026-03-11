from flask import Blueprint, request, jsonify
from .services import PodcastService

podcasts_bp = Blueprint('podcasts', __name__)
podcast_service = PodcastService()

@podcasts_bp.route('/', methods=['GET'])
def get_podcasts():
    podcasts = podcast_service.get_all_podcasts()
    return jsonify(podcasts)

@podcasts_bp.route('/<podcast_id>', methods=['GET'])
def get_podcast(podcast_id):
    podcast = podcast_service.get_podcast_by_id(podcast_id)
    return jsonify(podcast)

@podcasts_bp.route('/', methods=['POST'])
def create_podcast():
    data = request.json
    result = podcast_service.create_podcast(data)
    return jsonify(result), 201

@podcasts_bp.route('/<podcast_id>/episodes', methods=['GET'])
def get_episodes(podcast_id):
    episodes = podcast_service.get_episodes(podcast_id)
    return jsonify(episodes)

@podcasts_bp.route('/search', methods=['GET'])
def search_podcasts():
    query = request.args.get('q', '')
    # In a real app, logic would be in service
    return jsonify([])

@podcasts_bp.route('/top', methods=['GET'])
def get_top_podcasts():
    type = request.args.get('type', 'listened')
    # In a real app, logic would be in service
    return jsonify([])
