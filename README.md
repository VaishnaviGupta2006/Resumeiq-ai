# ResumeIQ AI

An AI-powered ATS Resume Analyzer that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Upload your resume and job description to receive detailed feedback on skills matching, keyword optimization, and overall ATS compatibility.

## Features

- **Resume Upload & Parsing**: Support for PDF and DOCX resume formats with automatic text extraction
- **ATS Scoring**: Comprehensive ATS compatibility score (0-100) based on job description alignment
- **Skills Analysis**: Matching and missing skills identification with visual comparison
- **Keyword Optimization**: Keyword matching analysis to improve ATS visibility
- **Section-Based Scoring**: Individual scores for Skills, Experience, Education, Projects, and Keywords
- **Actionable Recommendations**: Prioritized improvement suggestions (High, Medium, Low priority)
- **Analysis History**: View and manage previous resume analyses
- **Professional PDF Export**: Generate detailed analysis reports (in development)

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable UI components
- **Lucide React** - Icon library

### Backend
- **Flask** - Python web framework
- **MySQL** - Database for persistent storage
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction
- **OpenAI API** - AI-powered analysis

## Project Architecture

```
ResumeIQ-AI/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Configuration settings
│   ├── database/              # Database connection and utilities
│   ├── routes/                # API endpoints
│   │   └── resume_routes.py   # Resume upload and analysis routes
│   ├── services/              # Business logic
│   │   ├── ai_service.py      # AI analysis service
│   │   ├── parser_service.py  # Resume parsing service
│   │   └── ats_service.py     # ATS scoring service
│   ├── utils/                 # Helper utilities
│   ├── uploads/               # Uploaded resume files
│   ├── requirements.txt       # Python dependencies
│   └── schema.sql             # Database schema
├── frontend/
│   ├── app/                   # Next.js app directory
│   │   ├── (pages)/          # Page routes
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   ├── upload/       # Resume upload page
│   │   │   ├── analysis/     # Analysis results page
│   │   │   └── history/      # Analysis history page
│   ├── components/            # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── analysis-results.tsx
│   │   ├── report-template.tsx
│   │   └── history-list.tsx
│   ├── lib/                  # Utilities and API client
│   ├── public/               # Static assets
│   └── package.json          # Node.js dependencies
└── README.md
```

## How It Works

1. **Resume Upload**: User uploads a resume (PDF/DOCX) and optionally provides a job description
2. **Text Extraction**: Backend extracts text content from the resume file
3. **AI Analysis**: OpenAI API analyzes the resume against the job description (if provided)
4. **ATS Scoring**: System calculates ATS compatibility scores across multiple categories
5. **Results Display**: Frontend presents detailed analysis with visual scores, skill comparisons, and recommendations
6. **History Storage**: Analysis results are stored in MySQL database for future reference

## Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.9+
- MySQL 8.0+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=resumeiq
DB_PORT=3306
OPENAI_API_KEY=your_openai_api_key
```

6. Set up MySQL database:
```sql
CREATE DATABASE resumeiq;
```

7. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
pnpm dev
```

The frontend will start on `http://localhost:3000`

## API Overview

### POST /api/upload
Upload and analyze a resume
- **Body**: `multipart/form-data` with `file` (resume) and `job_description` (optional)
- **Response**: Analysis results with ATS score, skill matching, and recommendations

### GET /api/history
Retrieve analysis history
- **Response**: List of previous analyses with basic details

### GET /api/history/<analysis_id>
Get detailed analysis by ID
- **Response**: Complete analysis data including extracted text and full results

### DELETE /api/analysis/<analysis_id>
Delete an analysis and associated resume
- **Response**: Success confirmation

## Screenshots

### Landing Page
*[Placeholder: Landing page screenshot showing hero section and call-to-action]*

### Dashboard
*[Placeholder: Dashboard showing recent analyses and quick actions]*

### Resume Upload
*[Placeholder: Upload interface with drag-and-drop and job description input]*

### Analysis Results
*[Placeholder: Results page showing ATS score, skill comparisons, and recommendations]*

### Analysis History
*[Placeholder: History list with previous analyses and delete functionality]*

## Future Enhancements

- **User Authentication**: Implement secure user login and registration
- **Multiple Resume Versions**: Support for managing multiple resume versions
- **Job Description Library**: Save and reuse job descriptions
- **Advanced Analytics**: Trends and insights across multiple analyses
- **Export Formats**: Additional export options (Word, Excel)
- **Real-time Analysis**: Live preview during resume editing
- **Collaboration Features**: Share analyses with mentors or recruiters
- **Mobile Optimization**: Enhanced mobile experience

## Author

Developed as a full-stack web application demonstrating modern web development practices, AI integration, and user experience design.

**Tech Stack**: Next.js, React, TypeScript, Flask, MySQL, OpenAI API

---

*Note: This project is currently in active development. PDF export functionality and authentication are features under development.*
