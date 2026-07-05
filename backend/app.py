import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from config import Config

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for all routes
    CORS(app)
    
    # Register routes
    from routes.resume_routes import resume_bp
    app.register_blueprint(resume_bp, url_prefix='/api')
    
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "ok",
            "message": "ResumeIQ AI Backend Running"
        }), 200
    
    return app

if __name__ == '__main__':
    # Check if GEMINI_API_KEY is loaded
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    print(f"GEMINI_API_KEY loaded: {'Yes' if gemini_api_key else 'No'}")
    
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
