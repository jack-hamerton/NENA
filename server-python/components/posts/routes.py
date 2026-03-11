from flask import Blueprint, request, jsonify
from .services import PostService

posts_bp = Blueprint('posts', __name__)
post_service = PostService()

@posts_bp.route('/', methods=['GET'])
def get_posts():
    posts = post_service.get_all_posts()
    return jsonify(posts), 200

@posts_bp.route('/', methods=['POST'])
def create_post():
    data = request.json
    if not data or 'authorId' not in data or 'title' not in data or 'content' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    post = post_service.create_new_post(data)
    return jsonify(post), 201

@posts_bp.route('/<post_id>/like', methods=['POST'])
def like_post(post_id):
    data = request.json
    user_id = data.get('userId')
    if not user_id:
        return jsonify({"error": "Missing userId"}), 400
    
    success = post_service.like_existing_post(post_id, user_id)
    return jsonify({"success": success}), 200

@posts_bp.route('/<post_id>/comments', methods=['GET'])
def get_comments(post_id):
    comments = post_service.get_post_comments(post_id)
    return jsonify(comments), 200
