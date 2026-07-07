import os
import mysql.connector
from mysql.connector import Error
from typing import Optional, Dict, Any, List

class DatabaseError(Exception):
    """Raised when database operations fail."""
    pass

class Database:
    """Database connection and operations manager."""
    
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', '')
        self.database = os.getenv('DB_NAME', 'resumeiq')
        self.port = int(os.getenv('DB_PORT', '3306'))
        self.connection = None
    
    def connect(self) -> bool:
        """Establish database connection."""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database,
                port=self.port
            )
            if self.connection.is_connected():
                return True
            return False
        except Error as e:
            raise DatabaseError(f"Database connection failed: {str(e)}")
    
    def disconnect(self):
        """Close database connection."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
    
    def execute_query(self, query: str, params: tuple = ()) -> Any:
        """Execute a query and return results."""
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, params)
            
            if query.strip().upper().startswith('SELECT'):
                result = cursor.fetchall()
                cursor.close()
                return result
            else:
                self.connection.commit()
                last_id = cursor.lastrowid
                cursor.close()
                return last_id
        except Error as e:
            self.connection.rollback()
            raise DatabaseError(f"Query execution failed: {str(e)}")
    
    def initialize_schema(self):
        """Create tables if they don't exist."""
        # Create resume_uploads table
        create_uploads_table = """
        CREATE TABLE IF NOT EXISTS resume_uploads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            original_filename VARCHAR(255) NOT NULL,
            file_size BIGINT NOT NULL,
            extracted_text TEXT NOT NULL,
            job_description TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        
        # Create analysis_results table
        create_analysis_table = """
        CREATE TABLE IF NOT EXISTS analysis_results (
            id INT AUTO_INCREMENT PRIMARY KEY,
            upload_id INT NOT NULL,
            ats_score INT NOT NULL,
            recommendation VARCHAR(50) NOT NULL,
            overall_match TEXT NOT NULL,
            analysis_json JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (upload_id) REFERENCES resume_uploads(id) ON DELETE CASCADE
        )
        """
        
        try:
            self.execute_query(create_uploads_table)
            self.execute_query(create_analysis_table)
        except DatabaseError as e:
            raise DatabaseError(f"Schema initialization failed: {str(e)}")

# Singleton instance
_db_instance: Optional[Database] = None

def get_db() -> Database:
    """Get or create database instance."""
    global _db_instance
    if _db_instance is None:
        _db_instance = Database()
        _db_instance.connect()
        _db_instance.initialize_schema()
    return _db_instance
