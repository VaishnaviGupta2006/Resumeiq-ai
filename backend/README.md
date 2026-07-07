# ResumeIQ AI Backend

Flask backend for ResumeIQ AI application with MySQL database persistence.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Configure MySQL database:
- Ensure MySQL is running
- Create database: `CREATE DATABASE resumeiq;`
- Update `.env` with your database credentials:
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=resumeiq
  DB_PORT=3306
  ```

6. (Optional) Run schema.sql to create tables:
```bash
mysql -u root -p resumeiq < schema.sql
```
Note: Tables are auto-created on first run if they don't exist.

7. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{"status": "ok", "message": "Resume routes working"}`

### Resume Upload
- **POST** `/api/upload`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: resume file (PDF or DOCX)
  - `job_description`: job description text (required)
- Max file size: 10MB

**Success Response (201):**
```json
{
  "success": true,
  "filename": "resume_abc123.pdf",
  "original_filename": "my_resume.pdf",
  "file_size": 12345,
  "characters": 2450,
  "preview": "First 500 characters...",
  "analysis": {
    "ats_score": 85,
    "overall_match": "Good match with minor gaps",
    "summary": "...",
    "matching_skills": [...],
    "missing_skills": [...],
    "matched_keywords": [...],
    "missing_keywords": [...],
    "strengths": [...],
    "weaknesses": [...],
    "improvement_suggestions": [...],
    "section_scores": {...},
    "recommendation": "hire"
  },
  "upload_id": 1,
  "analysis_id": 1,
  "message": "Resume uploaded, parsed, analyzed, and saved successfully"
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "No file provided"
}
```

```json
{
  "success": false,
  "error": "Job description is required"
}
```

### Get Analysis History
- **GET** `/api/history`
- Returns all previous analyses ordered newest first (max 50)

**Success Response (200):**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "upload_id": 1,
      "filename": "resume_abc123.pdf",
      "original_filename": "my_resume.pdf",
      "ats_score": 85,
      "recommendation": "hire",
      "created_at": "2024-01-15T10:30:00"
    }
  ],
  "count": 1
}
```

### Get Analysis by ID
- **GET** `/api/history/<analysis_id>`
- Returns complete analysis details for a specific ID

**Success Response (200):**
```json
{
  "success": true,
  "id": 1,
  "upload_id": 1,
  "filename": "resume_abc123.pdf",
  "original_filename": "my_resume.pdf",
  "file_size": 12345,
  "extracted_text": "...",
  "job_description": "...",
  "ats_score": 85,
  "recommendation": "hire",
  "overall_match": "...",
  "analysis": {...},
  "created_at": "2024-01-15T10:30:00",
  "uploaded_at": "2024-01-15T10:29:00"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Analysis not found"
}
```

## Database Schema

### resume_uploads
- `id`: INT (Primary Key, Auto Increment)
- `filename`: VARCHAR(255) - Stored filename
- `original_filename`: VARCHAR(255) - Original uploaded filename
- `file_size`: BIGINT - File size in bytes
- `extracted_text`: TEXT - Extracted resume text
- `job_description`: TEXT - Job description used for analysis
- `uploaded_at`: TIMESTAMP - Upload timestamp

### analysis_results
- `id`: INT (Primary Key, Auto Increment)
- `upload_id`: INT (Foreign Key to resume_uploads)
- `ats_score`: INT - ATS score (0-100)
- `recommendation`: VARCHAR(50) - hire/consider/reject
- `overall_match`: TEXT - Overall match description
- `analysis_json`: JSON - Complete analysis data
- `created_at`: TIMESTAMP - Analysis timestamp

## Testing

### Using cURL

**Upload:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/resume.pdf" \
  -F "job_description=Senior Frontend Engineer role..."
```

**Get History:**
```bash
curl http://localhost:5000/api/history
```

**Get Analysis by ID:**
```bash
curl http://localhost:5000/api/history/1
```

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:5000/api/upload`
3. Go to Body tab
4. Select `form-data`
5. Add key `file` with type `File`
6. Add key `job_description` with type `Text`
7. Click Send
