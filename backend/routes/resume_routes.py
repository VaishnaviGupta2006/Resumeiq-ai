import os
from flask import Blueprint, request, jsonify
from config import Config
from utils.file_helpers import save_uploaded_file
from services.text_extractor import extract_text, UnsupportedFileTypeError, TextExtractionError
from services.ai_analyzer import analyze_resume, analyze_resume_general, validate_resume, AIAnalysisError, JSONParseError, ResumeValidationError
from database.db import get_db, DatabaseError

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/health', methods=['GET'])
def health():
    return {"status": "ok", "message": "Resume routes working"}

@resume_bp.route('/analysis/<int:analysis_id>', methods=['DELETE'])
def delete_analysis(analysis_id):
    """Delete an analysis and its associated resume upload."""
    try:
        db = get_db()
        
        # First get the upload_id and filename from the analysis
        get_upload_query = """
        SELECT ar.upload_id, ru.filename 
        FROM analysis_results ar
        JOIN resume_uploads ru ON ar.upload_id = ru.id
        WHERE ar.id = %s
        """
        upload_result = db.execute_query(get_upload_query, (analysis_id,))
        
        if not upload_result:
            return jsonify({
                "success": False,
                "error": "Analysis not found"
            }), 404
        
        upload_id = upload_result[0]['upload_id']
        filename = upload_result[0]['filename']
        
        # Delete the analysis record
        delete_analysis_query = "DELETE FROM analysis_results WHERE id = %s"
        db.execute_query(delete_analysis_query, (analysis_id,))
        
        # Delete the resume upload record
        delete_upload_query = "DELETE FROM resume_uploads WHERE id = %s"
        db.execute_query(delete_upload_query, (upload_id,))
        
        # Delete the physical file if it exists
        try:
            file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            # Log but don't fail the operation if file deletion fails
            print(f"Warning: Failed to delete file: {e}")
        
        return jsonify({
            "success": True,
            "message": "Analysis and resume deleted successfully"
        })
        
    except DatabaseError as e:
        return jsonify({
            "success": False,
            "error": f"Database error: {str(e)}"
        }), 500
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to delete analysis: {str(e)}"
        }), 500

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
    
    # Get job description from form data (optional)
    job_description = request.form.get('job_description', '')
    
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
        
        # Validate the resume before analysis
        validate_resume(extracted_text)
        
        # Analyze with AI - use general analysis if no job description, otherwise match against job
        if job_description and job_description.strip():
            analysis = analyze_resume(extracted_text, job_description)
        else:
            analysis = analyze_resume_general(extracted_text)
        
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
    except ResumeValidationError as e:
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

@resume_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Get dashboard analytics data."""
    try:
        db = get_db()
        
        # Get total counts and score statistics using SQL aggregation
        stats_query = """
        SELECT 
            COUNT(DISTINCT ru.id) as total_resumes,
            COUNT(DISTINCT ar.id) as total_analyses,
            AVG(ar.ats_score) as average_ats_score,
            MAX(ar.ats_score) as highest_ats_score,
            MIN(ar.ats_score) as lowest_ats_score
        FROM resume_uploads ru
        LEFT JOIN analysis_results ar ON ru.id = ar.upload_id
        """
        stats = db.execute_query(stats_query)[0]
        
        # Get recommendation counts
        recommendations_query = """
        SELECT 
            recommendation,
            COUNT(*) as count
        FROM analysis_results
        GROUP BY recommendation
        """
        rec_results = db.execute_query(recommendations_query)
        recommendations = {
            'hire': 0,
            'consider': 0,
            'reject': 0
        }
        for row in rec_results:
            if row['recommendation'] in recommendations:
                recommendations[row['recommendation']] = row['count']
        
        # Get recent uploads (last 5)
        recent_query = """
        SELECT 
            ar.id,
            ru.original_filename as filename,
            ar.ats_score,
            ar.recommendation,
            ar.created_at
        FROM analysis_results ar
        JOIN resume_uploads ru ON ar.upload_id = ru.id
        ORDER BY ar.created_at DESC
        LIMIT 5
        """
        recent_results = db.execute_query(recent_query)
        recent_uploads = []
        for row in recent_results:
            recent_uploads.append({
                'filename': row['filename'],
                'ats_score': row['ats_score'],
                'recommendation': row['recommendation'],
                'created_at': row['created_at'].isoformat() if row['created_at'] else None
            })
        
        # Get ATS trend (last 30 days, grouped by day)
        trend_query = """
        SELECT 
            DATE(ar.created_at) as date,
            AVG(ar.ats_score) as score
        FROM analysis_results ar
        WHERE ar.created_at IS NOT NULL
        GROUP BY DATE(ar.created_at)
        ORDER BY DATE(ar.created_at) ASC
        LIMIT 30
        """
        trend_results = db.execute_query(trend_query)
        ats_trend = []
        for row in trend_results:
            ats_trend.append({
                'date': row['date'].isoformat() if row['date'] else None,
                'score': round(float(row['score']), 1) if row['score'] is not None else 0
            })

        # Get weekly uploads (last 7 days, grouped by day)
        weekly_query = """
        SELECT 
            DAYNAME(ru.uploaded_at) as day,
            COUNT(*) as uploads
        FROM resume_uploads ru
        WHERE ru.uploaded_at IS NOT NULL
        GROUP BY DAYNAME(ru.uploaded_at)
        ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
        """
        weekly_results = db.execute_query(weekly_query)
        
        # Map to ensure all days are present
        day_order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        day_map = {
            'Monday': 'Mon',
            'Tuesday': 'Tue',
            'Wednesday': 'Wed',
            'Thursday': 'Thu',
            'Friday': 'Fri',
            'Saturday': 'Sat',
            'Sunday': 'Sun'
        }
        
        weekly_uploads_dict = {}
        for row in weekly_results:
            day_short = day_map.get(row['day'], 'Unknown')
            weekly_uploads_dict[day_short] = row['uploads']
        
        weekly_uploads = []
        for day in day_order:
            weekly_uploads.append({
                'day': day,
                'uploads': weekly_uploads_dict.get(day, 0)
            })
        
        return jsonify({
            "success": True,
            "total_resumes": stats['total_resumes'] or 0,
            "total_analyses": stats['total_analyses'] or 0,
            "average_ats_score": round(stats['average_ats_score'], 1) if stats['average_ats_score'] else 0,
            "highest_ats_score": stats['highest_ats_score'] or 0,
            "lowest_ats_score": stats['lowest_ats_score'] or 0,
            "recommendations": recommendations,
            "recent_uploads": recent_uploads,
            "ats_trend": ats_trend,
            "weekly_uploads": weekly_uploads
        }), 200
        
    except DatabaseError as e:
        return jsonify({
            "success": False,
            "error": f"Database error: {str(e)}"
        }), 500
