-- ResumeIQ Database Schema
-- MySQL

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS resumeiq;
USE resumeiq;

-- Resume uploads table
CREATE TABLE IF NOT EXISTS resume_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    extracted_text TEXT NOT NULL,
    job_description TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analysis results table
CREATE TABLE IF NOT EXISTS analysis_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    upload_id INT NOT NULL,
    ats_score INT NOT NULL,
    recommendation VARCHAR(50) NOT NULL,
    overall_match TEXT NOT NULL,
    analysis_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (upload_id) REFERENCES resume_uploads(id) ON DELETE CASCADE,
    INDEX idx_created_at (created_at),
    INDEX idx_ats_score (ats_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
