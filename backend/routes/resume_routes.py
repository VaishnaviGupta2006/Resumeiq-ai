import os
from flask import Blueprint, request, jsonify
from config import Config
from utils.file_helpers import save_uploaded_file
from services.text_extractor import extract_text, UnsupportedFileTypeError, TextExtractionError
from services.ai_analyzer import analyze_resume, AIAnalysisError, JSONParseError
from database.db import get_db, DatabaseError

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/health', methods=['GET'])
def health():
    return {"status": "ok", "message": "Resume routes working"}

@resume_bp.route('/upload', methods=['POST'])
def upload_resume():
    """Handle resume file upload, text extraction, ATS matching, and database persistence."""
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
    
    # Get job description from form data
    job_description = request.form.get('job_description', '')
    
    if not job_description:
        return jsonify({
            "success": False,
            "error": "Job description is required"
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
    
    # Extract text from the uploaded file
    file_path = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
    
    try:
        extracted_text = extract_text(file_path)
        character_count = len(extracted_text)
        preview = extracted_text[:500] if extracted_text else ""
        
        # Analyze with AI comparing resume to job description
        analysis = analyze_resume(extracted_text, job_description)
        
        # Save to database
        db = get_db()
        from database.models import ResumeUpload, AnalysisResult
        
        resume_upload = ResumeUpload(db)
        analysis_result = AnalysisResult(db)
        
        # Save upload record
        upload_id = resume_upload.create(
            filename=unique_filename,
            original_filename=file.filename,
            file_size=file_size,
            extracted_text=extracted_text,
            job_description=job_description
        )
        
        # Save analysis record
        analysis_id = analysis_result.create(
            upload_id=upload_id,
            ats_score=analysis['ats_score'],
            recommendation=analysis['recommendation'],
            overall_match=analysis['overall_match'],
            analysis_json=analysis
        )
        
        return jsonify({
            "success": True,
            "filename": unique_filename,
            "original_filename": file.filename,
            "file_size": file_size,
            "characters": character_count,
            "preview": preview,
            "analysis": analysis,
            "upload_id": upload_id,
            "analysis_id": analysis_id,
            "message": "Resume uploaded, parsed, analyzed, and saved successfully"
        }), 201
        
    except UnsupportedFileTypeError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except TextExtractionError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except AIAnalysisError as e:
        return jsonify({
            "success": False,
            "error": f"AI analysis failed: {str(e)}"
        }), 500
    except JSONParseError as e:
        return jsonify({
            "success": False,
            "error": f"Failed to parse AI response: {str(e)}"
        }), 500
    except DatabaseError as e:
        return jsonify({
            "success": False,
            "error": f"Database error: {str(e)}"
        }), 500

@resume_bp.route('/history', methods=['GET'])
def get_history():
    """Get all previous analyses ordered newest first."""
    try:
        db = get_db()
        from database.models import AnalysisResult
        
        analysis_result = AnalysisResult(db)
        history = analysis_result.get_all(limit=50)
        
        # Format response
        formatted_history = []
        for item in history:
            formatted_history.append({
                "id": item['id'],
                "upload_id": item['upload_id'],
                "filename": item['filename'],
                "original_filename": item['original_filename'],
                "ats_score": item['ats_score'],
                "recommendation": item['recommendation'],
                "created_at": item['created_at'].isoformat() if item['created_at'] else None
            })
        
        return jsonify({
            "success": True,
            "history": formatted_history,
            "count": len(formatted_history)
        }), 200
        
    except DatabaseError as e:
        return jsonify({
            "success": False,
            "error": f"Database error: {str(e)}"
        }), 500

@resume_bp.route('/history/<int:analysis_id>', methods=['GET'])
def get_analysis_by_id(analysis_id):
    """Get a complete analysis by ID."""
    try:
        db = get_db()
        from database.models import AnalysisResult
        
        analysis_result = AnalysisResult(db)
        analysis = analysis_result.get_by_id(analysis_id)
        
        if not analysis:
            return jsonify({
                "success": False,
                "error": "Analysis not found"
            }), 404
        
        # Parse analysis_json
        import json
        analysis_data = json.loads(analysis['analysis_json']) if analysis['analysis_json'] else {}
        
        return jsonify({
            "success": True,
            "id": analysis['id'],
            "upload_id": analysis['upload_id'],
            "filename": analysis['filename'],
            "original_filename": analysis['original_filename'],
            "file_size": analysis['file_size'],
            "extracted_text": analysis['extracted_text'],
            "job_description": analysis['job_description'],
            "ats_score": analysis['ats_score'],
            "recommendation": analysis['recommendation'],
            "overall_match": analysis['overall_match'],
            "analysis": analysis_data,
            "created_at": analysis['created_at'].isoformat() if analysis['created_at'] else None,
            "uploaded_at": analysis['uploaded_at'].isoformat() if analysis['uploaded_at'] else None
        }), 200
        
    except DatabaseError as e:
        return jsonify({
            "success": False,
            "error": f"Database error: {str(e)}"
        }), 500
