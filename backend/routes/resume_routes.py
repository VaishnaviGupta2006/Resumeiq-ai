import os
from flask import Blueprint, request, jsonify
from config import Config
from utils.file_helpers import save_uploaded_file

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/health', methods=['GET'])
def health():
    return {"status": "ok", "message": "Resume routes working"}

@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    """Handle resume file upload."""
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({
            "success": False,
            "error": "No file provided"
        }), 400
    
    file = request.files['file']
    
    # Check if filename is empty
    if file.filename == '':
        return jsonify({
            "success": False,
            "error": "No file selected"
        }), 400
    
    # Save the file
    unique_filename, error = save_uploaded_file(file, Config.UPLOAD_FOLDER)
    
    if error:
        return jsonify({
            "success": False,
            "error": error
        }), 400
    
    # Get file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    return jsonify({
        "success": True,
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_size": file_size,
        "message": "Resume uploaded successfully"
    }), 201
