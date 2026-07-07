from datetime import datetime
from typing import Dict, Any, Optional
from .db import Database, DatabaseError

class ResumeUpload:
    """Model for resume uploads."""
    
    def __init__(self, db: Database):
        self.db = db
    
    def create(self, filename: str, original_filename: str, file_size: int, 
               extracted_text: str, job_description: str) -> int:
        """Create a new resume upload record."""
        query = """
        INSERT INTO resume_uploads (filename, original_filename, file_size, extracted_text, job_description)
        VALUES (%s, %s, %s, %s, %s)
        """
        params = (filename, original_filename, file_size, extracted_text, job_description)
        return self.db.execute_query(query, params)
    
    def get_by_id(self, upload_id: int) -> Optional[Dict[str, Any]]:
        """Get a resume upload by ID."""
        query = "SELECT * FROM resume_uploads WHERE id = %s"
        result = self.db.execute_query(query, (upload_id,))
        return result[0] if result else None
    
    def get_all(self, limit: int = 50) -> list:
        """Get all resume uploads ordered by newest first."""
        query = "SELECT * FROM resume_uploads ORDER BY uploaded_at DESC LIMIT %s"
        return self.db.execute_query(query, (limit,))

class AnalysisResult:
    """Model for analysis results."""
    
    def __init__(self, db: Database):
        self.db = db
    
    def create(self, upload_id: int, ats_score: int, recommendation: str,
               overall_match: str, analysis_json: Dict[str, Any]) -> int:
        """Create a new analysis result record."""
        query = """
        INSERT INTO analysis_results (upload_id, ats_score, recommendation, overall_match, analysis_json)
        VALUES (%s, %s, %s, %s, %s)
        """
        import json
        params = (upload_id, ats_score, recommendation, overall_match, json.dumps(analysis_json))
        return self.db.execute_query(query, params)
    
    def get_by_id(self, analysis_id: int) -> Optional[Dict[str, Any]]:
        """Get an analysis result by ID."""
        query = """
        SELECT ar.*, ru.filename, ru.original_filename, ru.file_size, ru.extracted_text, ru.job_description, ru.uploaded_at
        FROM analysis_results ar
        JOIN resume_uploads ru ON ar.upload_id = ru.id
        WHERE ar.id = %s
        """
        result = self.db.execute_query(query, (analysis_id,))
        return result[0] if result else None
    
    def get_all(self, limit: int = 50) -> list:
        """Get all analysis results ordered by newest first."""
        query = """
        SELECT ar.id, ar.upload_id, ar.ats_score, ar.recommendation, ar.created_at,
               ru.filename, ru.original_filename
        FROM analysis_results ar
        JOIN resume_uploads ru ON ar.upload_id = ru.id
        ORDER BY ar.created_at DESC
        LIMIT %s
        """
        return self.db.execute_query(query, (limit,))
    
    def get_by_upload_id(self, upload_id: int) -> Optional[Dict[str, Any]]:
        """Get analysis result by upload ID."""
        query = "SELECT * FROM analysis_results WHERE upload_id = %s"
        result = self.db.execute_query(query, (upload_id,))
        return result[0] if result else None
