import os
from flask import Flask
from flask_cors import CORS
from components.communication.routes import communication_bp
from components.auth.routes import auth_bp
from components.posts.routes import posts_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(communication_bp, url_prefix='/api/communication')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(posts_bp, url_prefix='/api/posts')

    @app.route('/health')
    def health_check():
        return {"status": "healthy"}

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
