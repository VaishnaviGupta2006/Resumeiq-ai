# ResumeIQ AI Backend

Flask backend for ResumeIQ AI application.

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

5. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{"status": "ok", "message": "ResumeIQ AI Backend Running"}`

### Resume Upload
- **POST** `/api/upload`
- Content-Type: `multipart/form-data`
- Body: `file` (form field with the resume file)
- Accepted file types: PDF, DOCX
- Max file size: 10MB

**Success Response (201):**
```json
{
  "success": true,
  "filename": "resume_abc123.pdf",
  "original_filename": "my_resume.pdf",
  "file_size": 12345,
  "characters": 2450,
  "preview": "First 500 characters of extracted text...",
  "analysis": {
    "ats_score": 85,
    "summary": "Experienced software engineer with strong background in web development...",
    "strengths": ["Strong technical skills", "Good communication", "Leadership experience"],
    "weaknesses": ["Limited cloud experience", "Missing recent certifications"],
    "missing_keywords": ["Kubernetes", "AWS", "Docker"],
    "skills_detected": ["Python", "JavaScript", "React", "Flask"],
    "improvement_suggestions": ["Add cloud certifications", "Highlight recent projects"],
    "recommendation": "consider"
  },
  "message": "Resume uploaded, parsed, and analyzed successfully"
}
```

**Error Responses (400):**
```json
{
  "success": false,
  "error": "No file provided"
}
```

```json
{
  "success": false,
  "error": "No file selected"
}
```

```json
{
  "success": false,
  "error": "Invalid file type. Only PDF and DOCX files are allowed."
}
```

## Testing the Upload Endpoint

### Using cURL

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/your/resume.pdf"
```

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:5000/api/upload`
3. Go to Body tab
4. Select `form-data`
5. Add key `file` with type `File`
6. Select your PDF or DOCX file
7. Click Send
