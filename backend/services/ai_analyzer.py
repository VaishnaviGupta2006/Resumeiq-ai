import os
import json
import re
import google.generativeai as genai
from typing import Dict, Any

class AIAnalysisError(Exception):
    """Raised when AI analysis fails."""
    pass

class JSONParseError(Exception):
    """Raised when JSON parsing fails."""
    pass

def analyze_resume(resume_text: str) -> Dict[str, Any]:
    """
    Analyze resume text using Google Gemini AI.
    
    Args:
        resume_text: Extracted text from the resume
        
    Returns:
        Dictionary containing analysis results with the schema:
        {
            "ats_score": int,
            "summary": str,
            "strengths": list[str],
            "weaknesses": list[str],
            "missing_keywords": list[str],
            "skills_detected": list[str],
            "improvement_suggestions": list[str],
            "recommendation": str
        }
        
    Raises:
        AIAnalysisError: If AI analysis fails
        JSONParseError: If JSON parsing fails
    """
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise AIAnalysisError("GEMINI_API_KEY not found in environment variables")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"""Analyze the following resume and return ONLY valid JSON with this exact schema:
{{
  "ats_score": 0-100,
  "summary": "Brief 2-3 sentence summary of the candidate",
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "skills_detected": ["skill1", "skill2", ...],
  "improvement_suggestions": ["suggestion1", "suggestion2", ...],
  "recommendation": "Overall recommendation (hire/consider/reject)"
}}

SCORING GUIDELINES - BE CONSERVATIVE:
- 90-100: Outstanding (exceptional resume with measurable achievements, modern tech stack, strong formatting)
- 80-89: Strong (good resume with minor gaps)
- 70-79: Good (acceptable but needs improvements)
- 60-69: Average (significant weaknesses)
- Below 60: Weak (major issues)

PENALIZE HEAVILY FOR:
- Missing graduation dates
- Generic or vague summaries
- Lack of measurable achievements/quantifiable results
- Missing modern frameworks (React, Vue, Angular, etc.)
- Missing cloud technologies (AWS, GCP, Azure, Docker, Kubernetes)
- Weak or inconsistent formatting
- Missing Git/version control experience
- Missing testing skills (unit tests, integration tests)
- Missing deployment/CI/CD experience

DO NOT give scores above 80 unless the resume is truly exceptional with strong measurable achievements, modern tech stack, and excellent formatting.

Resume text:
{resume_text}

Return ONLY the JSON, no other text or markdown formatting."""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code fences if present
        response_text = re.sub(r'^```json\s*', '', response_text)
        response_text = re.sub(r'^```\s*', '', response_text)
        response_text = re.sub(r'\s*```$', '', response_text)
        
        # Parse JSON
        try:
            analysis = json.loads(response_text)
        except json.JSONDecodeError as e:
            raise JSONParseError(f"Failed to parse AI response as JSON: {str(e)}")
        
        # Validate required fields
        required_fields = [
            'ats_score', 'summary', 'strengths', 'weaknesses',
            'missing_keywords', 'skills_detected', 'improvement_suggestions', 'recommendation'
        ]
        
        for field in required_fields:
            if field not in analysis:
                raise JSONParseError(f"Missing required field in AI response: {field}")
        
        # Validate types
        if not isinstance(analysis['ats_score'], int):
            raise JSONParseError("ats_score must be an integer")
        
        if not isinstance(analysis['summary'], str):
            raise JSONParseError("summary must be a string")
        
        if not isinstance(analysis['recommendation'], str):
            raise JSONParseError("recommendation must be a string")
        
        list_fields = ['strengths', 'weaknesses', 'missing_keywords', 'skills_detected', 'improvement_suggestions']
        for field in list_fields:
            if not isinstance(analysis[field], list):
                raise JSONParseError(f"{field} must be a list")
        
        return analysis
        
    except Exception as e:
        if isinstance(e, (AIAnalysisError, JSONParseError)):
            raise
        raise AIAnalysisError(f"Unexpected error during AI analysis: {str(e)}")

